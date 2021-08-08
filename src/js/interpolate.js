export function mix(a, b, t) {
  return a * (1 - t) + b * t;
}

export function clamp(x, a = 0, b = 1) {
  return Math.min(b, Math.max(a, x));
}

export function invmix(a, b, x) {
  return clamp((x - a) / (b - a));
}

export function range(a, b, A, B, x) {
  // range(0, 10, 100, 200, 5) = 150
  return mix(A, B, invmix(a, b, x));
}
