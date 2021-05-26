function saturationdensity(t) {
  //t: air temperature [C]
  //returns: amount of water that air can hold at a given temperature [kg/m3]
  const T = t + 273.15;
  const density =
    ((0.0022 / T) * Math.exp(77.345 + 0.0057 * T - 7235 / T)) /
    Math.pow(T, 8.2);
  return density;
}

function dewpoint(t, rh) {
  /*    
  what is dewpoint?
  water will condense when air cools through contact with a surface if the surface is sufficiently cold
  (simply because air can hold less water when cold air can)
  this often happens in the morning when the surface/ground is colder than the air.

  t: air temperature [C]
  rh: relative humidity [0..1]
  returns: The surface temperature [C] required to produce water droplets on the surface
  */
  const b = 17.62;
  const c = 243.12;
  const g = Math.log(rh) + (b * t) / (c + t);
  const T = (c * g) / (b - g);
  return T;
}
