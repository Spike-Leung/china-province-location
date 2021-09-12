const fs = require("fs");
const {
  getLocation,
  recursionGetLocation,
  flatCityData,
  writeFileSync,
} = require("./utils");
const cityMap = {};
// docs: https://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
let concurrentMaxCount = 20;
const precision = 3;
const reqList = [];

let cityData = JSON.parse(fs.readFileSync("./data/pc-code.json")).concat([
  {
    code: "999990",
    name: "香港特别行政区",
  },
  {
    code: "999991",
    name: "澳门特别行政区",
  },
  {
    code: "999992",
    name: "台湾省",
  },
]);
const cityList = flatCityData(cityData);
const cityListCopy = JSON.parse(JSON.stringify(cityList));
const cityListWithLocation = [];

console.log("Start to fetch lat & lng...");

while (concurrentMaxCount--) {
  if (cityListCopy.length) {
    reqList.push(recursionGetLocation(cityListCopy, cityListWithLocation));
  }
}

Promise.all(reqList)
  .then(() => {
    cityListWithLocation.forEach((c) => {
      cityMap[c.code] = c;
    });

    cityData.forEach((c) => {
      const { lat, lng } = cityMap[c.code];
      c.lat = lat && lat.toFixed(precision);
      c.lng = lat && lng.toFixed(precision);

      Reflect.deleteProperty(c, "address");

      c.children &&
        c.children.forEach((child) => {
          const { lat: cLat, lng: cLng } = cityMap[child.code];

          child.lat = cLat && cLat.toFixed(precision);
          child.lng = cLat && cLng.toFixed(precision);
          Reflect.deleteProperty(child, "address");
        });
    });

    writeFileSync("./dist/city-location.json", JSON.stringify(cityData), (e) =>
      console.error(e)
    );
  })
  .then(() => {
    console.log("Done! File save at ./dist/city-location.json");
  });
