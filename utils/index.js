const fs = require("fs");
const getDirName = require("path").dirname;
const axios = require("axios");
const BAIDU_API_URL = "https://api.map.baidu.com/geocoding/v3/";
const ak = require("../data/baidu-ak.js");

const getLocation = (city) => {
  return axios
    .get(BAIDU_API_URL, {
      params: {
        ak,
        address: city.address,
        output: "json",
      },
    })
    .then((res) => {
      const AK_NOT_VALID_ERROR = ["AK", "ak"].some(
        (m) => res.data.message && res.data.message.indexOf(m) !== -1
      );

      if (AK_NOT_VALID_ERROR) {
        throw new Error(res.data.message);
      }

      if (res.status === 200 && res.data.status === 0) {
        const {
          data: {
            result: {
              location: { lat, lng },
            },
          },
        } = res;

        city.lat = lat;
        city.lng = lng;

        console.log(`${city.name}'s lat is ${lat}, lng is ${lng}`);
      } else {
        console.error(`[${city.name}]error when call getLocation`, res.data);
      }

      return city;
    });
};

const recursionGetLocation = (arr, targetArr) => {
  const city = arr.shift();
  return getLocation(city).then((cityWithLocation) => {
    targetArr.push(cityWithLocation);

    return new Promise((resolve) => {
      setTimeout(() => {
        if (arr.length > 0) {
          resolve(recursionGetLocation(arr, targetArr));
        } else {
          resolve("finish");
        }
      }, 300);
    });
  });
};

const writeFileSync = (path, contents, cb) => {
  fs.mkdir(getDirName(path), { recursive: true }, function (err) {
    if (err) {
      return cb(err);
    }

    fs.writeFileSync(path, contents, cb);
  });
};

const flatCityData = (cityData) => {
  return cityData.reduce((acc, curr) => {
    curr.address = curr.name;
    acc.push(curr);

    curr.children &&
      curr.children.forEach((c) => {
        c.address = `${curr.name}${c.name}`;

        acc.push(c);
      });

    return acc;
  }, []);
};

module.exports = {
  getLocation,
  recursionGetLocation,
  writeFileSync,
  flatCityData,
};
