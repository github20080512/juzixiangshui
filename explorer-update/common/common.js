var fs = require("fs");
var path = require("path");
var md5 = require("blueimp-md5");
let { globalShortcut } = require("electron");

function changeZoom(obj) {
  obj.webContents.on("zoom-changed", (e, zoomDirection) => {
    if (zoomDirection === "in") {
      obj.level = obj.level >= 3 ? obj.level : (obj.level += 0.2);
    } else {
      obj.level = obj.level <= -3 ? obj.level : (obj.level -= 0.2);
    }
    obj.webContents.setZoomLevel(obj.level);
  });
}

function openFind(obj) {
  obj.on("focus", () => {
    globalShortcut.register("CommandOrControl+F", function () {
      if (obj && obj.webContents) {
        obj.webContents.send("on-find", "");
      }
    });
  });
  obj.on("blur", () => {
    globalShortcut.unregister("CommandOrControl+F");
  });
}

function setTop(obj){
  obj.on("focus", () => {
    globalShortcut.register("ctrl+alt+1", function () {
      if(obj.isTop){
        obj.setAlwaysOnTop(false);
        obj.isTop = false
      }else{
        obj.setAlwaysOnTop(true);
        obj.isTop = true
      }
    });

  });
  obj.on("blur", () => {
    globalShortcut.unregister("ctrl+alt+1");
   
  });
}

function startHttpServe(port, router) {
  const express = require("express");
  const expressApp = express();

  expressApp.set("views", path.join(__dirname, "../../person/express/views"));

  expressApp.use(
    express.static(path.join(__dirname, "../../person/express/public"))
  );
  expressApp.use(
    express.static("C:/Users/ADMIN/Music")
  );

  expressApp.engine("html", require("express-art-template"));
  var bodyParser = require("body-parser");
  // parse application/x-www-form-urlencoded
  // expressApp.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  // expressApp.use(bodyParser.json());

  expressApp.use(bodyParser.json({ limit: "100mb" }));
  expressApp.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  expressApp.use(router);

  expressApp.listen(port, () => {});
}

var toCode = function (str, key) {
  var len = key.length;
  var a = key.split("");
  var s = "",
    b,
    b1,
    b2,
    b3;
  for (var i = 0; i < str.length; i++) {
    b = str.charCodeAt(i);

    b1 = b % len;
    b = (b - b1) / len;
    b2 = b % len;
    b3 = (b - b2) / len;

    s += a[b3] + a[b2] + a[b1];
  }

  return s;
};

var fromCode = function (str, key) {
  var len = key.length;
  var b,
    b1,
    b2,
    b3,
    d = 0,
    s;
  s = new Array(Math.floor(str.length / 3));
  b = s.length;
  for (var i = 0; i < b; i++) {
    b1 = key.indexOf(str.charAt(d));
    d++;
    b2 = key.indexOf(str.charAt(d));
    d++;
    b3 = key.indexOf(str.charAt(d));
    d++;
    s[i] = b1 * len * len + b2 * len + b3;
  }

  b = eval("String.fromCharCode(" + s.join(",") + ")");
  return b;
};

function code(str, direction, key, str1) {
  let res = "";

  let arr = str.split("");

  let str2 = str1.split("").sort().join("");
  let a, b;
  if (direction == 1) {
    a = str1;
    b = str2;
  } else {
    a = str2;
    b = str1;
  }
  arr.forEach((item, index) => {
    if (a.indexOf(item) > -1) {
      arr[index] = b[a.indexOf(item)];
    } else {
      if (direction == 1) {
        let r = toCode(item, key);
        if (r.length == 3) {
          arr[index] = "<-" + r + "->";
        } else {
          arr[index] = item;
        }
      }
    }
  });

  res = arr.join("");

  return res;
}

function change(str, key, str1) {
  if(key=="" || str1==""){
    return str
  }
  return code(str, 1, key, str1);
}

function get(str, key, str1) {
  if(key=="" || str1==""){
    return str
  }
  var r = /<-[\s\S]{3}->/g;
  var arr = str.match(r);
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      str = str.replace(arr[i], fromCode(arr[i].substring(2, 5), key));
    }
  }
  return code(str, 0, key, str1);
}

function MD5(str) {
  return md5(md5(md5(str)));
}

function d(n) {
  if (n < 10) {
    return "0" + n;
  }
  return n;
}

function time(n) {
  let date = new Date();
  let hour = date.getHours();
  let mimute = date.getMinutes();
  let second = date.getSeconds();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hourStr = d(hour) + ":" + d(mimute) + ":" + d(second);
  if (n == null) {
    return hourStr;
  } else if (n == "date") {
    return d(day);
  } else if (n == "month") {
    return d(month);
  } else if (n == "year") {
    return d(year);
  } else if (n == "full") {
    return year + "-" + d(month) + "-" + d(day) + " " + hourStr;
  }
}
module.exports = {
  changeZoom,
  startHttpServe,
  change,
  get,
  MD5,
  time,
  openFind,
  setTop
};
