function shaderlayout() {
  return {
    attributes: {
      clipspace: 2,
    },
    uniforms: {
      canvassize: "uniform2fv",
      cloudcoverage: "uniform1f",
      rain: "uniform1f",
      ts: "uniform1f",
      solzenazi: "uniform2fv",
      coeffs: "uniform3fv",
      cY: "uniform1fv",
      cx: "uniform1fv",
      cy: "uniform1fv",
      turbidity: "uniform1f", //amount of particles in atmosphere (basically haziness)
      cloudtex: "uniform1i",
      cloudtex2: "uniform1i",
      dt: "uniform1f",
      time: "uniform1f",
    },
  };
}

function shaderuniforms() {
  return {
    canvassize: [1, 1],
    cloudcoverage: 0,
    rain: 0,
    ts: 12,
    solzenazi: [0, 0],
    coeffs: [1, 1, 1],
    cY: [0, 0, 0, 0, 0],
    cx: [0, 0, 0, 0, 0],
    cy: [0, 0, 0, 0, 0],
    turbidity: 4,
    cloudtex: 0,
    cloudtex2: 1,
    dt: 0,
    time: 0,
  };
}

function context(canvas) {
  let gl = canvas.getContext("webgl2");
  gl || alert("You need a browser with webgl2. Try Firefox or Chrome.");
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  return gl;
}

function draw(gl, program, uniforms) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  setuniforms(gl, program, uniforms);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
}

function bindquad(gl, program) {
  const index = new Uint32Array([0, 1, 2, 2, 3, 0]);
  const clipspace = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
  gl.bindVertexArray(gl.createVertexArray());
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.attributes.clipspace.loc);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.vertexAttribPointer(
    program.attributes.clipspace.loc,
    program.attributes.clipspace.sz,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.bufferData(gl.ARRAY_BUFFER, clipspace, gl.STATIC_DRAW);
}

function setuniforms(gl, program, uniforms) {
  for (let name in program.uniforms) {
    gl[program.uniforms[name].func](program.uniforms[name].loc, uniforms[name]);
  }
}

//PROGRAM
function shaderprogram(gl, layout, common, text) {
  let verttext = common.concat("\n#define VERT;\n", text);
  let fragtext = common.concat("\n#define FRAG;\n", text);

  let vert = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vert, verttext);
  gl.compileShader(vert);

  let frag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(frag, fragtext);
  gl.compileShader(frag);

  let program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  program.attributes = getattributes(gl, program, layout.attributes);
  program.uniforms = getuniforms(gl, program, layout.uniforms);
  console.log("program: ", program);

  return program;
}

function getattributes(gl, program, layout) {
  let attributes = {};
  for (let name in layout) {
    let loc = gl.getAttribLocation(program, name);
    if (loc !== -1) {
      attributes[name] = { loc: loc, sz: layout[name] };
    }
  }
  return attributes;
}

function getuniforms(gl, program, layout) {
  let uniforms = {};
  for (let name in layout) {
    let loc = gl.getUniformLocation(program, name);
    if (loc !== null) {
      uniforms[name] = { loc: loc, func: layout[name] };
    }
  }
  return uniforms;
}

//Textures
function bind2dtexture(gl, arraybuffer, i = 0) {
  gl.activeTexture(gl.TEXTURE0 + i);
  let tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);

  let sz = 32;
  storetexImage2D(gl, sz, sz, arraybuffer);

  //set texture parameters here
  //see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function bind3dtexture(gl, arraybuffer, i = 0) {
  gl.activeTexture(gl.TEXTURE0 + i);
  let tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_3D, tex);

  var sz = 32;
  storetexImage3D(gl, sz, sz, sz, arraybuffer);

  gl.generateMipmap(gl.TEXTURE_3D);
}

function storetexImage2D(gl, X, Y, arraybuffer) {
  //assume rgba aka 4 bytes per pixel holding r,g,b,a values
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    X,
    Y,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array(arraybuffer)
  );
}

function storetexImage3D(gl, X, Y, Z, arraybuffer) {
  //assume r8 aka 1 byte per pixel
  gl.texImage3D(
    gl.TEXTURE_3D,
    0,
    gl.R8,
    X,
    Y,
    Z,
    0,
    gl.RED,
    gl.UNSIGNED_BYTE,
    new Uint8Array(arraybuffer)
  );
}

const webgl = {
  bind2dtexture,
  bind3dtexture,
  shaderlayout,
  shaderuniforms,
  context,
  bindquad,
  shaderprogram,
  draw,
};

export default webgl;
