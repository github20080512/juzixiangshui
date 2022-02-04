(function () {
  let {
    app,
    shell,
    BrowserWindow,
    globalShortcut,
    ipcMain,
  } = require("electron");
  let {
    startHttpServe,
    change,
    get,
    changeZoom,
    MD5,
    time,
    openFind,
    setTop
  } = require("./common/common");

  let { checkword } = require("./common/checkword");
  let { readMusic } = require("./common/readMusicName");

  var MusicPath = "C:\\Users\\ADMIN\\Music";
  var isNote = false;

  var mainWindow = null;
  var sonWindow = [];
  var fs = require("fs");
  var path = require("path");
  var bodyParser = require("body-parser");
  var cmd = require("node-cmd");
  var xlsx = require("node-xlsx");
  const { clipboard } = require("electron");
  let { getHttpResult, httpRequest } = require("./express/http");

  let otherUserPsd = {};

  let timeOut = null;
  let info = {};
  let AutoClose = {};
  let isAuth = false;
  let show = true;
  let isFrame = true;
  let content = "first login";

  let timeoutJudge = false;
  let windowNumber = 0;
  let httpPort = 56565;
  let allowSendData = {};

  let dataPath = {
    record: "../person/forcopy/record.json",
    note: "../person/forcopy/note.json",
    copyexe: "../person/copy.exe",
    log: "../person/forcopy/log.txt",
    forcopy: "../person/forcopy/forcopy.js",
    configue: "../person/forcopy/configue.json",
    theme: "../person/temp/skin/skin/skin17/theme.json",
    skin: "../person/temp/skin/skin/skin6/skin.json",
    tHtml: "../person/translate/1.html",
  };

  const { Notification } = require("electron");

  function showNotification(title, body) {
    new Notification({ title: title, body: body }).show();
  }

  //str
  let skin = {};
  let key = "";
  let str1 = "";
  //translate
  let translateSrc = "";
  let translateresult = "";
  /*
  common fn
  */

  function completePath(pathname, other) {
    if (other) {
      return path.resolve(other, pathname);
    }
    return path.resolve(__dirname, pathname);
  }

  function checkLoginTime(arg) {
    if (
      arg.value &&
      allowSendData[arg.name] &&
      allowSendData[arg.name]["time"] == arg.value
    ) {
      return true;
    } else return false;
  }

  function checkPsd(psd, name) {
    let answer = {};
    if (!otherUserPsd.settings) {
      answer.needSet = true;
      return answer;
    }
    if (MD5(psd) == otherUserPsd.settings.theme[name]) {
      allowSendData[name] = {};
      allowSendData[name].time = new Date().getTime();
      answer.isAuth = true;
      answer.time = allowSendData[name].time;
    }
    return answer;
  }

  function readFile() {
    try {
      let str = fs.readFileSync(completePath(dataPath.configue));

      info = JSON.parse(str.toString());
      AutoClose = info.settings.AutoClose;
      MusicPath = info.settings.otherPath;
      httpPort = info.settings.httpPort.httpPort;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  function readThemeFile() {
    try {
      let str = fs.readFileSync(completePath(dataPath.theme));

      otherUserPsd = JSON.parse(str.toString());
    } catch (e) {
      console.log(e);
    }
  }

  function newWindow(url, w, h, frame, jsString) {
    if(url.indexOf("@-@")>-1){
      var afterPath = url.replace("@-@","../")
      url = path.resolve(__dirname, afterPath)
    }
    let theFrame;
    if (frame) {
      theFrame = false;
    } else {
      theFrame = isFrame;
    }
    let returnvalue = null;
    let newJUdge = true;
    sonWindow.map((item, index) => {
      if (item.url == url) {
        newJUdge = false;
        if (!show) {
          item.show();
        }
        item.setAlwaysOnTop(true);
        item.setAlwaysOnTop(false);
        item.focus();
        returnvalue = item;
      }
    });

    if (!newJUdge) {
      return returnvalue;
    } else {
      var secondWindow = new BrowserWindow({
        width: w || info.settings.subinterface.width * 1,
        height: h || info.settings.subinterface.height * 1,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
          webviewTag: true,
        },
        //Frameless
        frame: theFrame,
      });
      var httpReg = /^http/;
      var htmlReg = /html$/;
      if (url.match(httpReg)) {
        secondWindow.loadURL(url);
      } else if (url.match(htmlReg)) {
        secondWindow.loadFile(url);
      }

      secondWindow.level = 0;
      changeZoom(secondWindow);

      secondWindow.index = windowNumber;
      secondWindow.url = url;

      openFind(secondWindow);
      setTop(secondWindow);

      secondWindow.on("close", () => {
        sonWindow = sonWindow.filter((item, index) => {
          return item.index != secondWindow.index;
        });
        secondWindow = null;
        globalShortcut.unregister("CommandOrControl+F");
      });
      if (jsString) {
        secondWindow.webContents.once("dom-ready", () => {
          secondWindow.webContents.executeJavaScript(jsString);
        });
      }

      sonWindow.push(secondWindow);
      windowNumber++;
      return secondWindow;
    }
  }
  //main Shortcut
  function openFileOrUrl(shortStr, url, jsStr) {
    globalShortcut.register(shortStr, () => {
      excuteTimeOut();
      if (!isAuth) {
        return;
      }
      newWindow(url, false, false, false, jsStr);
    });
  }

  function log(str) {
    try {
      content = fs.readFileSync(completePath(dataPath.log));
      fs.appendFile(completePath(dataPath.log), str, function (err, data) {
        if (err) {
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  function excuteTimeOut() {
    clearTimeout(timeOut);
    timeOut = setTimeout(function () {
      allowSendData = {};
      isAuth = false;
      show = false;
      timeoutJudge = true;
      mainWindow.hide();
      for (let i = 0; i < sonWindow.length; i++) {
        sonWindow[i].hide();
      }
    }, 60000 * 50);
  }

  function conversation() {
    //writeExls
    ipcMain.on("writeExls", (event, arg) => {
      excuteTimeOut();
      var buffer = xlsx.build(arg.exdata);
      fs.writeFile(arg.exPath, buffer, function (err) {
        if (err) {
          console.log(err);
          event.returnValue = err;
          return;
        }
        event.returnValue = "success";
      });
    });
    //changestr
    ipcMain.on("changestr", (event, arg) => {
      if (checkLoginTime(arg)) {
        event.returnValue = change(arg.str, key, str1);
      } else {
        event.returnValue = arg.str;
      }
    });
    //getstr
    ipcMain.on("getstr", (event, arg) => {
      if (checkLoginTime(arg)) {
        event.returnValue = get(arg.str, key, str1);
      } else {
        event.returnValue = arg.str;
      }
    });

    //readData
    ipcMain.on("readData", (event, arg) => {
      let thePath = arg.readPath;
      fs.readFile(thePath, function (err, data) {
        if (err) {
          console.log(err);
          event.returnValue = { err };
          return;
        }
        event.returnValue = { data: data.toString() };
      });
    });
    //writeData
    ipcMain.on("writeData", (event, arg) => {
      fs.writeFile(arg.readPath, arg.data, function (err) {
        if (err) {
          console.log(err);
          event.returnValue = { err };
          return;
        }
        event.returnValue = {};
      });
    });

    //son html logout
    ipcMain.on("isLogout", (event, arg) => {
      allowSendData[arg.name] = null;
      event.returnValue = "success";
    });
    //extentant conversation
    // arg {readPath,psd}
    //
    ipcMain.on("checkPsd", (event, arg) => {
      //checkPsd(psd,name)

      let answer = checkPsd(arg.value, arg.name);

      event.returnValue = answer;
    });

    //ask http
    ipcMain.on("askhttp", (event, arg) => {
      httpRequest(arg, function (data) {
        event.returnValue = data;
      });
    });
  }

  function registerShortcut() {
    //main process shortcut
    let totalArr = [];
    totalArr.push(...info["url"]);
    totalArr.push(...info["file"]);
    totalArr.forEach(function (item) {
      openFileOrUrl(item["shortcut"], item["content"], item["jsStr"]);
    });

    info["cmd"].forEach(function (item) {
      globalShortcut.register(item.shortcut, () => {
        excuteTimeOut();
        if (!isAuth) {
          return;
        }
        cmd.run(item.content, function (err, data, stderr) {});
      });
    });
    info["quickCopy"].forEach(function (item) {
      globalShortcut.register(item.shortcut, () => {
        excuteTimeOut();
        if (!isAuth) {
          return;
        }

        let copyPath = completePath(dataPath.forcopy);
        fs.writeFile(
          copyPath,
          get(item.content, key, str1),
          function (err, data) {
            if (err) {
              console.log(err);
              return;
            }
            // 65001 ：utf-8
            // 20936 :   GB2312
            // 936 :   GBK
            cmd.run(
              "chcp 65001 && clip < " + copyPath,
              function (err, data, stderr) {
                fs.writeFile(copyPath, "over", function (err, data) {
                  if (err) {
                    console.log(err);
                  }
                });
              }
            );
          }
        );
      });
    });

    globalShortcut.register("alt+q", () => {
      excuteTimeOut();
      if (show) {
        mainWindow.hide();
        for (let i = 0; i < sonWindow.length; i++) {
          sonWindow[i].hide();
        }
      } else {
        if (timeoutJudge) {
          mainWindow.show();
        } else {
          for (let i = 0; i < sonWindow.length; i++) {
            sonWindow[i].show();
          }
          mainWindow.show();
        }
      }
      show = !show;
    });
    globalShortcut.register("ctrl+alt+w", () => {
      app.quit();
    });

    globalShortcut.register("F4", () => {
      const { exec, spawn } = require("child_process");
      exec(
        completePath(dataPath.copyexe) + " copy 0",
        (err, stdout, stderr) => {
          var str = clipboard.readText();
          if (str == "" || str.indexOf("\t") > -1) {
            showNotification("translate", "please check the string");
            return;
          }

          var jsString = ` 
                console.log("This loads no problem!"); 
                const ipcRenderer = require("electron").ipcRenderer;
                ipcRenderer.on("on-test", (e, args) => {
                  var translateInput= document.querySelector("#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.UnxENd > span > span > div > textarea");
                  translateInput.value=args.str;
                
                if(args.str.length<100){

                  var h=document.createEvent("HTMLEvents");h.initEvent("input", true, true);
                  translateInput.dispatchEvent(h);
                }
                
               
              });
            `;

          var subWindow = newWindow(
            "https://translate.google.cn/",
            820,
            400,
            1,
            jsString
          );

          subWindow.webContents.send("on-test", {
            str,
          });
        }
      );
    });

    globalShortcut.register("ctrl+shift+c", () => {
      var str = clipboard.readText();
      if (str == "" || str.indexOf("\t") > -1) {
        showNotification("translate", "please check the string");
        return;
      }
      translateresult = "";
      translateSrc = str;
      var subWindow = newWindow(completePath(dataPath.tHtml), 420, 220);

      if (str.length > 15) {
        subWindow.webContents.send("on-translate", {
          translateSrc,
          translateresult: "PLEASE CONFIRM",
        });
        return;
      }

      let url =
        `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=` + str;
      httpRequest(url, function (data) {
        var result = JSON.parse(data);

        translateSrc = result.translateResult[0][0]["src"];
        translateresult = result.translateResult[0][0]["tgt"];
        subWindow.webContents.send("on-translate", {
          translateSrc,
          translateresult,
        });
      });
    });



    //Zoom

    globalShortcut.register("ctrl+alt+0", () => {
      excuteTimeOut();
      level = 0;
      mainWindow.webContents.setZoomLevel(0);
      for (let i = 0; i < sonWindow.length; i++) {
        sonWindow[i].webContents.setZoomLevel(0);
      }
    });

    //Zoom

    mainWindow.level = 0;
    changeZoom(mainWindow);
    //click note

    globalShortcut.register("ctrl+alt+3", () => {
      excuteTimeOut();
      mainWindow.show();
      // mainWindow.webContents.send("clickNote");
      isNote = true
      setTimeout(()=>{
        isNote = false;
      },500)
    });
  }

  /*
  common fn
  */
  ////////////////////////////////////////////////////////////
  //http

  const express = require("express");
  let router = express.Router();

  router.get("/:aid", function (req, res) {
    var aid = req.params.aid;
    if (aid == "server") {
      res.render("../views/server.html");
    } else if (aid.indexOf("music") > -1) {
      const file = MusicPath + "\\" + aid.split("*-*")[1];

      const stat = fs.statSync(file);

      const total = stat.size;

      if (req.headers.range) {
      }
      fs.exists(file, (exists) => {
        if (exists) {
          const range = req.headers.range;
          const parts = range.replace(/bytes=/, "").split("-");

          const partialStart = parts[0];

          const partialEnd = parts[1];

          const start = parseInt(partialStart, 10);
          const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
          const chunksize = end - start + 1;
          const rstream = fs.createReadStream(file, { start: start, end: end });

          res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "audio/mpeg",
          });
          rstream.pipe(res);
        } else {
          res.send("Error - 404");
          res.end();
          // res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
          // fs.createReadStream(path).pipe(res);
        }
      });
    } else {
      res.render("../public/index.html");
    }
  });

  router.post("/request/musicNames", function (req, res) {
    let arr = readMusic(MusicPath);

    for (var i = 0; i < 10; i++) {
      arr.sort(() => {
        return Math.random() - 0.5;
      });
    }

    var str = "http://localhost:" + httpPort;
    res.send({
      arr,
      str,
    });
  });

  router.post("/request/userlogin", function (req, res) {
    let arg = req.body.psd;

    let answer = checkPsd(arg, "251214");
    if (answer.isAuth) {
      let temPath = completePath(dataPath.skin);
      try {
        var temstr = fs.readFileSync(temPath);

        try {
          skin = JSON.parse(temstr.toString());
        } catch (e) {}
        key = skin.key ? skin.key : "";
        str1 = skin.str1 ? skin.str1 : "";
      } catch (e) {
        console.log(e);
        return;
      }

      timeoutJudge = false;

      isFrame = true;
      isAuth = true;
      excuteTimeOut();
      let arr = content.toString().split("\r\n");
      if (arr.length > 5) {
        arr.splice(0, arr.length - 5);
      }
      answer.log = arr.join("<br>");
      answer.info = info;
      if (key == "" || str1 == "") {
        answer.needInformation = true;
      }

      for (let i = 0; i < sonWindow.length; i++) {
        sonWindow[i].show();
      }
      mainWindow.show();
    } else if (answer.needSet) {
      res.send(answer);
      return;
    } else {
      let str = "\r\nerr password:\t";
      log(str);
    }
    res.send(answer);
  });
  router.post("/request/writeLifeData", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    info = arg;

    fs.writeFile(
      completePath(dataPath.configue),
      JSON.stringify(arg),
      function (err, data) {
        if (err) {
          console.log(err);
          res.send({ status: 0 });
          return;
        }
        res.send({ status: 1 });
      }
    );
  });

  router.post("/request/readData", function (req, res) {
    excuteTimeOut();
    let arg = req.body;

    let str = fs.readFileSync(completePath(dataPath[arg.path]));

    res.send(get(str.toString(), key, str1));
  });

  router.post("/request/writeData", function (req, res) {
    excuteTimeOut();
    let arg = req.body;

    fs.writeFile(
      completePath(dataPath[arg.path]),
      change(JSON.stringify(arg.content), key, str1),
      function (err, data) {
        if (err) {
          console.log(err);
          res.send({ status: 0 });
          return;
        }
        res.send({ status: 1 });
      }
    );
  });

  router.post("/request/excuteNewWidow", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    newWindow(arg.url);
    res.send({ status: 1 });
  });

  router.post("/request/excuteShell", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    shell.openExternal(arg.url);
    res.send({ status: 1 });
  });

  router.post("/request/excutecmd", function (req, res) {
    excuteTimeOut();
    let arg = req.body.content;
    cmd.run(arg, function (err, data, stderr) {
      res.send({
        err,
        data,
        stderr,
      });
    });
  });

  router.post("/request/excutePa", async function (req, res) {
    excuteTimeOut();
    let arg = req.body;

    let answer = await getHttpResult(arg);
    let obj = {
      answer,
      other: arg.other,
    };
    res.send(obj);
  });

  router.post("/request/setScreen", async function (req, res) {
    excuteTimeOut();
    let arg = req.body.str;

    if (arg == "window-min") {
      mainWindow.minimize();
    } else if (arg == "window-close") {
      app.quit();
    } else if (arg == "window-full") {
      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false);
      } else {
        mainWindow.setFullScreen(true);
      }
    }

    res.send({ status: 1 });
  });

  router.post("/request/changestr", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    if (checkLoginTime(arg)) {
      if (arg.method == "get") {
        res.send(get(arg.str, key, str1));
      } else if (arg.method == "change") {
        res.send(change(arg.str, key, str1));
      }
    } else {
      res.send(arg.str);
    }
  });

  router.post("/request/excuteCopy", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    let copyPath = completePath(dataPath.forcopy);
    fs.writeFile(copyPath, arg.content, function (err, data) {
      if (err) {
        console.log(err);
        res.send({ status: 0 });
        return;
      }
      // 65001 ：utf-8
      // 20936 :   GB2312
      // 936 :   GBK
      cmd.run("chcp 65001 && clip < " + copyPath, function (err, data, stderr) {
        fs.writeFile(copyPath, "over", function (err, data) {
          if (err) {
            console.log(err);
          }
        });
      });
      res.send({ status: 1 });
    });
  });

  router.post("/request/setIsFrame", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    isFrame = arg.isFrame;

    res.send({ status: 1 });
  });

  router.post("/request/setUsers", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    let answer = checkPsd(arg.oldPsd, arg.username);
    if (!answer.isAuth) {
      res.send({ status: 0 });
    } else {
      otherUserPsd.settings.theme[arg.username] = MD5(arg.newPsd);
      fs.writeFile(
        completePath(dataPath.theme),
        JSON.stringify(otherUserPsd),
        function (err, data) {
          if (err) {
            console.log(err);
          }
        }
      );

      res.send({ status: 1 });
    }
  });

  router.post("/request/setInformation", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    let answer = checkPsd(arg.oldPsd, arg.username);
    if (!answer.isAuth) {
      res.send({ status: 0 });
    } else {
      if (key != "") {
        res.send({ status: 2 });
        return;
      }
      key = arg.key;
      str1 = arg.str1;
      skin = { key, str1 };

      fs.writeFile(
        completePath(dataPath.skin),
        JSON.stringify(skin),
        function (err, data) {
          if (err) {
            console.log(err);
          }
        }
      );
      res.send({ status: 1 });
    }
  });

  router.post("/request/changeInformation", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    let answer = checkPsd(arg.oldPsd, arg.username);
    if (!answer.isAuth) {
      res.send({ status: 0 });
    } else {
      if (key == "" || str1 == "") {
        res.send({ status: 2 });
        return;
      }
      let recordStr = fs.readFileSync(completePath(dataPath["record"]));
      recordStr = get(recordStr.toString(), key, str1);
      recordStr = change(recordStr, arg.key, arg.str1);

      fs.writeFile(
        completePath(dataPath.record),
        recordStr,
        function (err, data) {
          if (err) {
            console.log(err);
          }
        }
      );

      info["quickCopy"].forEach((item) => {
        item.content = change(get(item.content, key, str1), arg.key, arg.str1);
      });

      fs.writeFile(
        completePath(dataPath.configue),
        JSON.stringify(info),
        function (err, data) {
          if (err) {
            console.log(err);
          }
        }
      );

      key = arg.key;
      str1 = arg.str1;
      skin = { key, str1 };

      fs.writeFile(
        completePath(dataPath.skin),
        JSON.stringify(skin),
        function (err, data) {
          if (err) {
            console.log(err);
          }
        }
      );

      res.send({ status: 1 });
    }
  });

  router.post("/request/clearInformation", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    let answer = checkPsd(arg.oldPsd, arg.username);
    if (!answer.isAuth) {
      res.send({ status: 0 });
    } else {
      key = "";
      str1 = "";
      skin = { key, str1 };

      fs.writeFile(
        completePath(dataPath.skin),
        JSON.stringify(skin),
        function (err, data) {
          if (err) {
            console.log(err);
          }
        }
      );

      res.send({ status: 1 });
    }
  });

  router.post("/request/checkword", function (req, res) {
    excuteTimeOut();
    let arg = req.body;

    arg.checkReg = eval(arg.checkReg);
    arg.extandReg = eval(arg.extandReg);

    res.send(checkword(arg));
  });

  router.post("/request/checkLoginTimeout", function (req, res) {
    excuteTimeOut();
    let arg = req.body;
    let answer = { isLoginTimeout: true,isNote };
    if (checkLoginTime(arg)) {
      answer.isLoginTimeout = false;
    }
    res.send(answer);
  });

  router.post("/request/serve", async function (req, res) {
    let answer = {
      arr: [],
      err: [],
    };
    try {
      answer.arr = await getHttpResult(req.body);
    } catch (e) {
      answer.err = e;
    }

    res.send(JSON.stringify(answer));
  });

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
    return;
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      if (mainWindow) {
        if (!show) mainWindow.show();
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
  }

  readFile();
  readThemeFile();
  startHttpServe(httpPort, router);
  console.log("don't believe your eyes");

  app.on("ready", () => {
    let logstr = "\r\n" + time("full") + "\tlogin.";
    log(logstr);
    mainWindow = new BrowserWindow({
      width: info.settings.maininterface.width * 1,
      height: info.settings.maininterface.height * 1,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        // webSecurity:false
      },
      //Frameless
      frame: false,
    });

    mainWindow.loadURL("http://localhost:" + httpPort);
    conversation();
    registerShortcut();

    //AutoClose

    if (AutoClose.isAutoClose * 1) {
      setInterval(function () {
        if (time() == AutoClose.closeTime) {
          app.quit();
        }
      }, 1000);
    }

    openFind(mainWindow);
    setTop(mainWindow);

    mainWindow.on("close", () => {
      let logstr = "\r\n" + time("full") + "\tlogout.";
      log(logstr);
      mainWindow = null;
    });
  });
})();
