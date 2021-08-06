#version 300 es
// settings precision is required (sometimes...)
precision mediump float; // max float is 2^14=16384
// precision mediump sampler2D;
// precision highp float; //max float is 2^62
precision mediump sampler3D; // setting (any) precision is required for some
// reason precision highp sampler3D;

#define s(a, b, x) smoothstep(a, b, x)
#define PI 3.14159265359
#define clamp01(x) clamp(x, 0.0, 1.0)
#define max0(x) max(x, 0.0)
#define invmix(a, b, t) clamp((t - a) / (b - a), 0.0, 1.0)

float perez(float zenith, float g, float c[5]) {
  return (1.0 + c[0] * exp(c[1] / cos(zenith))) *
         (1.0 + c[2] * exp(c[3] * g) + c[4] * pow(cos(g), 2.0));
}

float gammacorrect(float u) {
  return (u <= 0.0031308) ? 12.92 * u : pow(1.055 * u, 0.4166667) - 0.055;
}
vec3 srgb2rgb(vec3 rgb) {
  return vec3(gammacorrect(rgb.x), gammacorrect(rgb.y), gammacorrect(rgb.z));
}

vec3 XYZ2rgb(vec3 XYZ) {
  mat3 T = mat3(3.2404542, -0.9692660, 0.0556434, -1.5371385, 1.8760108,
                -0.2040259, -0.4985314, 0.0415560, 1.0572252);
  return srgb2rgb(T * XYZ);
}

vec3 Yxy2XYZ(vec3 Yxy) {
  float Y = Yxy.x;
  float x = Yxy.y;
  float y = Yxy.z;
  return vec3(Y * x / y, Y, Y * (1.0 - x - y) / y);
}

vec3 Yxy2rgb(vec3 Yxy) { return XYZ2rgb(Yxy2XYZ(Yxy)); }

vec3 solarzenithcoeffs(float t, float z) {
  vec3 Z = vec3(z * z * z, z * z, z); // z: solarzenith
  vec3 T = vec3(t * t, t, 1.0);       // t: turbidity

  // skylight distribution coefficients
  mat3 Mx = mat3(0.00166, -0.02903, 0.11693, -0.00375, 0.06377, -0.21196,
                 0.00209, -0.03202, 0.06052);
  vec3 bx = vec3(0.0, 0.00394, 0.25886);
  mat3 My = mat3(0.00275, -0.04214, 0.15346, -0.00610, 0.08970, -0.26756,
                 0.00317, -0.04153, 0.06670);
  vec3 by = vec3(0.0, 0.00516, 0.26688);

  float Y =
      (4.0453 * t - 4.971) * tan((4.0 / 9.0 - t / 120.0) * (PI - 2.0 * z)) -
      0.2155 * t + 2.4192;
  Y = Y / 40.0; // normalize (brightness) to range 0..1 ish
  float x = dot(T, Mx * Z + bx);
  float y = dot(T, My * Z + by);
  return vec3(Y, x, y);
}

vec3 zenazi2rd(float zen, float azi) {
  // starting from (0,1,0) aka "in zenith=0"
  // zen is rotation around x, azi is rotation around y
  // in other words: zen is how far down the sun is, with 0 straight up and pi/2
  // at horizon azi is how far east the sun is with 0 meaning south and pi/2
  // meaning east, pi meaning north this is how the sun position is described
  // but here its also how every pixel is described by using z-axis as south and
  // x-axis as east.
  return vec3(sin(azi) * sin(zen), cos(zen), cos(azi) * sin(zen));
}

float clouddistance(vec3 rd) {
  float earthr = 6371.0 * 4.0; // meters (actually 6371000 meters irl)
  float loweratmo = 1500.0;    // clouds lower atmosphere
  // float upperatmo=4000.0; //clouds upper atmosphere

  // create a sphere and get distance to it
  float y = -earthr;            // center of sphere
  float r = earthr + loweratmo; // radius of sphere

  // iSphere on that
  float o = -y;
  float b = 2.0 * o * rd.y;
  float c = o * o - r * r;
  float h = b * b - 4.0 * c;
  return 0.5 * (sqrt(h) - b); // assumes looking from inside
}

mat3 dir2rotmat(vec3 b) {
  // https://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d/897677#897677
  mat3 eye = mat3(1.0);
  // mat3 eyeflip = mat3(1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, 1.0);
  if (b.y == 1.0) {
    return eye;
  }
  // if (b.y==-1.0) {return eyeflip;}

  vec3 a = vec3(0.0, 1.0, 0.0);
  vec3 v = cross(a, b);
  mat3 S = mat3(0.0, v.z, -v.y, -v.z, 0.0, v.x, v.y, -v.x, 0.0);
  float k = (1.0 - dot(a, b)) / dot(v, v);
  mat3 R = eye + S + S * S * k;
  return R;
}

// HG(u,0.76)*0.065454; //normalized HG assuming g=0.76
float HG(float u, float g) {
  return 0.5 * (1.0 - g * g) * pow(1.0 + g * g - 2.0 * g * u, -1.5);
} // henyey-greenstein
float B(float d) { return exp(-d); }             // beers
float P(float d) { return 1.0 - exp(-2.0 * d); } // powder

//////////
// Rain //
//////////

mat2 rotmat(float r) {
  float c = cos(r);
  float s = sin(r);
  return mat2(c, s, -s, c);
}

float dtoa(float d, float amount) {
  return clamp01(1.0 / (clamp(d, 1.0 / amount, 1.0) * amount));
}

float sdAxisAlignedRect(vec2 uv, vec2 tl, vec2 br) {
  vec2 d = max(tl - uv, uv - br);
  return length(max(vec2(0.0), d)) + min(0.0, max(d.x, d.y));
}

vec2 hash(vec2 p) {
  vec2 a = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return 2.0 * fract(sin(a) * 43758.5453123) - 1.0;
}

float noise(vec2 p) {
  float K1 = 0.366025404; // (sqrt(3)-1)/2;
  float K2 = 0.211324865; // (3-sqrt(3))/6;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;

  vec3 h = max0(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)));
  vec2 hash1 = hash(i + 0.0);
  vec2 hash2 = hash(i + o);
  vec2 hash3 = hash(i + 1.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash1), dot(b, hash2), dot(c, hash3));
  return clamp01(0.5 * (0.5 + dot(n, vec3(70.0))));
}
