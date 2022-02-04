const http = require("http");
const https = require("https");
const cheerio = require("cheerio");
function filterData(loadstr, serverPath, method) {
  let theRes = [];
  const $ = cheerio.load(loadstr);
  $(serverPath).each((index, el) => {
    let str;
    if (method == "text") {
      str = $(el).text();
    } else if (method == "html") {
      str = $(el).html();
    } else if (method == "attr") {
      str = $(el).attr("href");
    } else {
      str = $(el).text();
    }
    theRes.push(str);
  });
  return theRes;
}

function httpRequest(serverUrl, succFn, failFn) {
  let httpObj = {};
  let data = "";
  if (serverUrl.indexOf("https") > -1) {
    httpObj = https;
  } else {
    httpObj = http;
  }

  try {
    httpObj.get(serverUrl, (result) => {
      result.on("data", (chunk) => {
        data += chunk;
      });
      result.on("end", () => {
        succFn && succFn(data);
      });
    });
  } catch (e) {
    failFn && failFn(e);
  }
}

function getHttpResult(obj) {
  return new Promise((resolve, reject) => {
    let arr = [];

    let { serverUrl, serverPath, method } = obj;

    httpRequest(
      serverUrl,
      function (loadstr) {
        arr = filterData(loadstr, serverPath, method);
        resolve(arr);
      },
      function (e) {
        arr.push(e);
        reject(arr);
      }
    );
  });
}
// it can't work
// module.exports = getHttpResult;
// module.exports = httpRequest;
module.exports = {
  getHttpResult,
  httpRequest,
};
