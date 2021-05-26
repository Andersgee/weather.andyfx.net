/*
async function fetchweather(url) {
  const forecast = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    }); // Convert data to json

  return forecast;
}
*/

async function fetchweather(url) {
  const forecast = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
  return forecast;
}

export function forecast5day3h() {
  const appid = "e95b492d3c977db6b58b95f097683036";
  const baseurl = "https://api.openweathermap.org/data/2.5/forecast";
  const longlat = [16.33, 59.91];
  const url = `${baseurl}?lon=${longlat[0]}&lat=${longlat[1]}&appid=${appid}`;
  fetchweather(url).then((data) => {
    return data;
  });
}
