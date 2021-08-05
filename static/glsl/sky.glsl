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
  clouddiffuse = 0.7 * smoothstep(0.25, 1.0, cloudcoverage);

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
  vec3 texcoord = 0.0005 * (p + offset + vec3(0.0, 0.41 * p.y, 0.11 * p.z));
  return texture(cloudtex, texcoord).x;
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

  vec3 offset = 0.02 * vec3(0.0, -2.61 * dt, 1.0 * dt); // put wind/movement
                                                        // here
  offset += vec3(0.0, -time * 80.0, 0.0);

  float hg = HG(dot(sundir, rd), 0.5) * 0.5; // phase
  float sumclouddens = 0.0;

  vec3 col = skyrgb; // start with some color and attenuate it
  vec3 p;
  float clouddens, lightdens, energy;

  float k = 2.0;
  // vec3 ambient = mix(skyrgb,mix(sunrgb,vec3(1.0),0.5),0.5);
  float sunheight =
      1.0 - 0.5 * solzenazi.x / PI; // 0 at horizon, 1 at straight up
  vec3 ambient = mix(skyrgb, sunrgb, sunheight);

  for (float t = 0.0; t < 20.0 * ss; t += ss) {
    p = ro + t * rd;
    clouddens =
        cloudsharpness * dens(p, offset); // how dense this point is with clouds
    lightdens =
        cloudsharpness *
        lightconedens(p, p0, p1, p3, p5, p6,
                      offset); // how much light is refracted into this point
                               // (based on some density samples nearby)
    energy =
        B(k * lightdens) * P(k * clouddens) *
        hg; // energy = B * P * HG (Schneider & Vos, 2015)
            // https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn
    // col = mix(col, ambient, energy);
    col = mix(mix(col, ambient, energy), col + sunrgb * energy, clouddens);
    sumclouddens += clouddens;
  }

  float alpha = 1.0 - B(sumclouddens);
  return vec4(col, alpha);
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

  vec3 skyrgb = skycolor(zenith, azimuth);
  vec3 sunrgb = skycolor(0.99 * solzenazi.x, solzenazi.y);

  vec4 cloudrgba = cloudcolor(ro, rd, sundir, skyrgb, sunrgb);

  fragcolor = vec4(mix(skyrgb, cloudrgba.xyz, cloudrgba.w), 1.0);
  // fragcolor.x = cloudcoverage;
  // vec3 offset = vec3(0.0);
  // vec3 kek = dens(p, offset);
  // fragcolor = vec4(kek.x, 0.0, 0.0, 1.0);
  // float a = texture(cloudtex, p*0.0005).x;
  // fragcolor = vec4(a*10.0, a, a, 1.0);
}

#endif