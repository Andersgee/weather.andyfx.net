#ifdef VERT

in vec2 clipspace;

uniform float cloudcoverage;

out float cloudsharpness;
out float clouddiffuse;
out vec2 vclipspace;

void main() {
  vclipspace = clipspace;
  gl_Position = vec4(clipspace, 0.0, 1.0);

  // more diffuse at higher coverage
  clouddiffuse = 0.75 * smoothstep(0.25, 1.0, cloudcoverage);

  // less sharpness at high coverage
  cloudsharpness = cloudcoverage - 0.2 * smoothstep(0.25, 0.75, cloudcoverage);
}

#endif

///////////////////////////////////////////////////////////////////////////////

#ifdef FRAG

in vec2 vclipspace;
in float cloudsharpness;
in float clouddiffuse;

uniform vec2 canvassize;
uniform float cloudcoverage;
uniform float rain;

uniform float ts;
uniform float turbidity;
uniform vec2 solzenazi;
uniform float cY[5];
uniform float cx[5];
uniform float cy[5];
uniform float dt;
uniform float time; // seconds since animstart

uniform sampler3D cloudtex;
uniform sampler3D cloudtex2;

out vec4 fragcolor;

vec3 skycolor(float zenith, float azimuth) {
  vec3 c = solarzenithcoeffs(turbidity, solzenazi.x);
  float g = acos(sin(solzenazi.x) * sin(zenith) * cos(azimuth - solzenazi.y) +
                 cos(solzenazi.x) * cos(zenith));
  float zen = min(zenith, 0.5 * PI);

  float Y = c.x * perez(zen, g, cY) / perez(0.0, solzenazi.x, cY);
  float x = c.y * perez(zen, g, cx) / perez(0.0, solzenazi.x, cx);
  float y = c.z * perez(zen, g, cy) / perez(0.0, solzenazi.x, cy);
  return Yxy2rgb(vec3(Y, x, y));
}

float dens(vec3 p, vec3 offset) {
  // larger diffuse effect at top of screen
  float diffuseeffect = (0.25 + 0.75 * smoothstep(-1.0, 0.5, vclipspace.y));

  vec3 texcoord = 0.0005 * (p + offset + vec3(0.0, 0.41 * p.y, 0.11 * p.z));
  return clouddiffuse * diffuseeffect + texture(cloudtex, texcoord).x;
}

float lightconedens(vec3 p, vec3 p0, vec3 p1, vec3 p3, vec3 p5, vec3 p6,
                    vec3 o) {
  float d0 = 2.0 * dens(p + p0, o);
  float d1 = 0.5 * dens(p + p1, o);
  float d3 = 0.5 * dens(p + p3, o);
  float d5 = 0.5 * dens(p + p5, o);
  float d6 = 0.25 * dens(p + p6, o);
  float d = d0 + d1 + d3 + d5 + d6;
  return d / 3.75;
}

vec4 cloudcolor(vec3 ro, vec3 rd, vec3 sundir, vec3 skyrgb, vec3 sunrgb) {
  // some points in a cone for lightsamples
  float ss = 50.0; // stepsize
  mat3 R = dir2rotmat(sundir);
  vec3 p0 = 0.5 * ss * R * vec3(0.0, 1.0, 0.0);
  vec3 p1 = 2.0 * ss * R * vec3(0.242535, 0.970142, 0.000000);
  vec3 p3 = 2.0 * ss * R * vec3(-0.196215, 0.970142, 0.142558);
  vec3 p5 = 2.0 * ss * R * vec3(0.074947, 0.970142, -0.230665);
  vec3 p6 = 4.0 * ss * R * vec3(0.0, 1.0, 0.0);

  // put wind/movement here
  vec3 offset = 0.02 * vec3(0.0, -2.61 * dt, 1.0 * dt);
  offset += vec3(0.0, -time * 80.0, 0.0);

  float hg = HG(dot(sundir, rd), 0.5) * 0.5; // phase
  float sumclouddens = 0.0;

  // start with some color and attenuate it
  vec3 col = skyrgb;
  vec3 p;
  float clouddens, lightdens, energy;

  float k = 2.0;
  // does rain affect phase?
  float r = 2.0 + smoothstep(0.0, 1.5, rain) * hg * 3.0;

  // sunheight 0 at horizon, 1 at straight up
  float sunheight = 1.0 - 0.5 * solzenazi.x / PI;
  vec3 ambient = mix(skyrgb, sunrgb, sunheight);

  for (float t = 0.0; t < 20.0 * ss; t += ss) {
    p = ro + t * rd;
    // how dense this point is with clouds
    clouddens = cloudsharpness * dens(p, offset);
    sumclouddens += clouddens;

    // how much light is refracted into this point
    // (based on some density samples nearby)
    lightdens = cloudsharpness * lightconedens(p, p0, p1, p3, p5, p6, offset);

    // energy = B * P * HG (Schneider & Vos, 2015)
    // https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn
    energy = B(r * lightdens) * P(k * clouddens) * hg;

    // col = mix(col, ambient, energy);
    col = mix(mix(col, ambient, energy), col + sunrgb * energy, clouddens);
  }

  float alpha = 1.0 - B(sumclouddens);
  return vec4(col, alpha);
}

vec3 brushstroke_aligned(vec2 uv, vec2 uvPaper, vec3 inpColor, vec4 brushColor,
                         vec2 p1, vec2 p2) {
  vec2 posInLine = smoothstep(p1, p2, uv);

  float wobbleAmplitude = 0.13;
  uv.x += sin(posInLine.y * 6.283185 * 0.2) * wobbleAmplitude;

  float d = sdAxisAlignedRect(uv, p1, vec2(p1.x, p2.y));
  d -= abs(p1.x - p2.x) * 0.5;

  posInLine = pow(posInLine, vec2(0.7)); // falloff.

  float strokeStrength = dtoa(d, 100.);

  // couple of frequencies
  vec2 f1 = vec2(1.119, 1.0);  // low
  vec2 f2 = vec2(8.233, 1.0);  // medium
  vec2 f3 = vec2(43.092, 1.0); // high
  vec2 p = p2 - uv;
  float strokeAlpha = noise(f1 * p) + noise(f2 * p) + noise(f3 * p);

  float r = 1.0 - posInLine.y;
  strokeAlpha = 0.66 * strokeAlpha * strokeStrength;
  strokeAlpha -= r;
  strokeAlpha = r * (1.0 - strokeAlpha);

  const float inkOpacity = 0.85;
  float fillAlpha = (dtoa(abs(d), 90.0) * (1.0 - inkOpacity)) + inkOpacity;

  float alpha = fillAlpha * strokeAlpha * brushColor.a;
  return mix(inpColor, brushColor.rgb, alpha);
}

vec3 brushstroke(vec2 uv, vec3 bgcol, vec4 col, vec2 p1, vec2 p2, float width) {
  vec2 rect = p2 - p1;
  float angle = atan(rect.x, rect.y);
  mat2 R = rotmat(angle);
  return brushstroke_aligned(R * uv, uv, bgcol, col, R * p1 - width,
                             R * p2 + width);
}

void main(void) {
  // between 30 and 90 degrees from horizontal
  float fovy_offset = PI / 6.0;
  float fovy = 2.0 * PI / 6.0;

  // between -120 and +120 degrees from south
  float fovx = 2.0 * PI / 3.0;

  float zenith = fovy_offset + (-vclipspace.y * 0.5 + 0.5) * fovy;
  float azimuth = vclipspace.x * fovx / 2.0;

  vec3 rd = zenazi2rd(zenith, azimuth);
  vec3 sundir = zenazi2rd(solzenazi.x, solzenazi.y);
  vec3 ro = clouddistance(rd) * rd; // where clouds start

  // larger rain effect at bottom of screen
  // float raineffect = 0.8 - 0.75 * smoothstep(-0.95, 0.2, vclipspace.y);
  float rainfactor = smoothstep(0.0, 1.5, rain);

  vec3 skyrgb = skycolor(zenith, azimuth);
  vec3 sunrgb = skycolor(0.99 * solzenazi.x, solzenazi.y);
  vec4 cloudrgba = cloudcolor(ro, rd, sundir, skyrgb, sunrgb);
  // cloudrgba.xyz = mix(cloudrgba.xyz, cloudrgba.xyz * 0.1, rainfactor);
  fragcolor = vec4(mix(skyrgb, cloudrgba.xyz, cloudrgba.w), 1.0);

  //////////
  // RAIN //
  //////////

  vec2 uv = vclipspace.xy * 0.5 + 0.5;
  float vrain = (rain > 0.0) ? 2.0 : 1.0;
  float t = ts / 24.0 + fract(time);

  vec4 raincol = vec4(mix(skyrgb, cloudrgba.xyz, 0.66) * 0.25 / vrain, 0.9);
  vec2 startpoint = vec2(-1.3, 0.5 - 2.5 * t);
  vec2 endpoint = vec2(-1.3, -1.0 - 2.5 * t);
  float width = 2.0;

  vec3 rainbrushrgb =
      brushstroke(uv, fragcolor.xyz, raincol, startpoint, endpoint, width);

  // fade in effect when moving down in
  float rainbrusheffect = 1.0 - sqrt(uv.y);
  rainbrushrgb =
      mix(fragcolor.xyz, rainbrushrgb, smoothstep(0.0, 1.0, rainbrusheffect));

  fragcolor.xyz = mix(fragcolor.xyz, rainbrushrgb, 0.5 * clamp01(2.0 * rain));
}

#endif