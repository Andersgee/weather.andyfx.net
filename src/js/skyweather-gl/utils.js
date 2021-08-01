export function mousexy(node, e) {
  let { left, top } = node.getBoundingClientRect();
  let x = (e.clientX - left) / node.width;
  let y = (e.clientY - top) / node.height;
  return [x, y];
}

export function setcanvassize(gl, canvas, uniforms) {
  canvas.width = canvas.parentNode.clientWidth;
  canvas.height = Math.round((canvas.width * 9) / 21);
  //canvas.height = canvas.parentNode.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height); //this is important to also adjust
  uniforms.canvassize = [canvas.width, canvas.height];
}

export function debounce(fn, ms) {
  //only call fn if it has not been called in the last ms interval
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}
