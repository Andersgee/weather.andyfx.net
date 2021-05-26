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

export function densitydifference(airtemperature, relativehumidity) {
  //How a tree gets water. layman description (see transpiration stream):
  //Water is pulled from leaves. (its not "pushed" from roots)
  //The rate of water pull depends on how fast the leaves are losing water.

  //How fast are leaves losing water then?
  //Leaves have pores with humid air, usually on the underside of leaves (see stomata)
  //The rate at which this humid air "leaks" (see gas exchange) out of the leaf is proportional to
  //the *difference in water concentration* of the air on inside/outside leaf.

  //So estimate a water concentration on the inside and outside.
  //The difference between them directly correlate with how much water is lost,
  //and (if roots are active) how much a tree will "dry out" the soil in its pot.

  //This entire app/website is essentially visualizing the value calculated here in this function.
  //Because SMHI et al. doesnt give this information, which is very much useful for my bonsai.

  //notes:
  //According to (some reference here) the relative humidity inside the leaf tries to stay at 99.3%
  //airpressure is technically involved in these calculations but the atmospheric pressure changes (which do exist) are insignificant to the outcome.

  const density_saturated = saturationdensity(airtemperature);

  const density_stomata = density_saturated * 0.993;
  const density_air = density_saturated * relativehumidity;

  const difference = density_stomata - density_air; //[kg/m3]

  return difference * 1000; //[g/m3]
}
