import webgl from "./webgl";
import { setcanvassize, debounce } from "./utils";

const sin = (x) => Math.sin(x);
const asin = (x) => Math.asin(x);
const cos = (x) => Math.cos(x);
const atan = (y, x) => Math.atan2(y, x);
const PI = Math.PI;

const solartime = (J, ts, SM, L) =>
  ts +
  0.17 * sin((4 * PI * (J - 80)) / 373) -
  0.129 * sin((2 * PI * (J - 8)) / 355) +
  (12 * (SM - L)) / PI;
const solardeclination = (J) => 0.4093 * sin((2 * PI * (J - 81)) / 368); //in radians
const solarzenith = (t, d, l) =>
  0.5 * PI - asin(sin(l) * sin(d) - cos(l) * cos(d) * cos((PI * t) / 12));
const solarazimuth = (t, d, l) =>
  atan(
    -cos(d) * sin((PI * t) / 12),
    cos(l) * sin(d) - sin(l) * cos(d) * cos((PI * t) / 12)
  );

const d2r = (d) => (d * PI) / 180;

function solarposition(J, ts, L, l, SM) {
  const t = solartime(J, ts, SM, L);
  const d = solardeclination(J);
  return [solarzenith(t, d, l), solarazimuth(t, d, l)];
}

//turbidity distribution coefficients
const coeffY = (t) => [
  0.1787 * t - 1.463,
  -0.3554 * t + 0.4275,
  -0.0227 * t + 5.3251,
  0.1206 * t - 2.5771,
  -0.067 * t + 0.3703,
];
const coeffx = (t) => [
  -0.0193 * t - 0.2592,
  -0.0665 * t + 0.0008,
  -0.0004 * t + 0.2125,
  -0.0641 * t - 0.8989,
  -0.0033 * t + 0.0452,
];
const coeffy = (t) => [
  -0.0167 * t - 0.2608,
  -0.095 * t + 0.0092,
  -0.0079 * t + 0.2102,
  -0.0441 * t - 1.6537,
  -0.0109 * t + 0.0529,
];

function timestandard(date) {
  return date.getHours() + date.getMinutes() / 60;
}

function dayOfYear(date) {
  return Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
}

export default class Skyweather {
  constructor(canvas, glsls, textures) {
    let glslcommon = glsls[0];
    let glsl = glsls[1];
    let tex3d = textures[0];
    let tex3d2 = textures[1];

    this.canvas = canvas;
    this.gl = webgl.context(this.canvas);
    this.layout = webgl.shaderlayout();

    this.uniforms = webgl.shaderuniforms();
    this.shader = webgl.shaderprogram(this.gl, this.layout, glslcommon, glsl);
    this.gl.useProgram(this.shader);
    webgl.bindquad(this.gl, this.shader);
    webgl.bind3dtexture(this.gl, tex3d, 0);
    webgl.bind3dtexture(this.gl, tex3d2, 1);

    this.handlesizing();
    window.addEventListener("resize", this.resizehandler);

    this.animstart = performance.now();
    this.animate();
  }

  resizehandler = debounce(() => this.handlesizing(), 100);

  handlesizing() {
    setcanvassize(this.gl, this.canvas, this.uniforms);
  }

  setuniforms(data, city) {
    this.uniforms.cloudcoverage = data.cloudiness;

    this.uniforms.rain = data.rain;
    //console.log("rain:", this.uniforms.rain);
    //console.log("cloudcoverage:", this.uniforms.cloudcoverage);

    const ts = timestandard(data.date);
    const J = dayOfYear(data.date);
    //const J = 300; //julian date 1..365
    //const L = d2r(16.321638); //site Longitude
    //const l = d2r(59.914009); //site latitude
    //const SM = d2r(L); //time zone standard meridian

    const L = d2r(city.coord.lon);
    const l = d2r(city.coord.lat);
    const SM = d2r((15 * city.timezone) / 3600); //each 3600 seconds is 15 degrees

    this.uniforms.ts = ts;
    this.uniforms.solzenazi = solarposition(J, ts, L, l, SM);
    //console.log("solzenazi: ", this.uniforms.solzenazi);

    this.uniforms.cY = coeffY(this.uniforms.turbidity);
    this.uniforms.cx = coeffx(this.uniforms.turbidity);
    this.uniforms.cy = coeffy(this.uniforms.turbidity);

    this.uniforms.dt = 0;
    //wasm.solarposition(ptr.solzenazi,  J, uniforms.ts, L,l,SM);
    //wasm.skycoeffs(ptr.coeffs, ptr.cY, ptr.cx, ptr.cy,  ptr.solzenazi, uniforms.turbidity)
  }

  animate = (timestamp) => {
    this.uniforms.time = (timestamp - this.animstart) / 1000;
    webgl.draw(this.gl, this.shader, this.uniforms);
    this.animframe = requestAnimationFrame(this.animate);
  };
}
