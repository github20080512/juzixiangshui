var fs = require("fs");

function checkword(arg) {
  let checkWordResult = {
    otherFiles: [],
    checkResultArr: [],
    err: [],
  };

  function readDir(val) {
    let arrFiles = [];
    const files = fs.readdirSync(val);
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      const stat = fs.lstatSync(val + "\\" + item);
      if (stat.isDirectory() === true ) {
        if(!arg.excludeDir.includes(item)){
          arrFiles = arrFiles.concat(readDir(val + "\\" + item));
        }
      } else {
        if (arg.extandReg.test(item)) {
          checkWordResult.otherFiles.push(val + "\\" + item);
        } else {
          arrFiles.push(val + "\\" + item);
        }
      }
    }
    return arrFiles;
  }

  try {
    var dirArr = readDir(arg.targetPath);

    dirArr.forEach((element) => {
      var str = fs.readFileSync(element, function (err, data) {}).toString();

      if (arg.checkReg.test(str)) {
        let singleObj = {};
        singleObj.path = element;
        singleObj.str = [];
        let strarr = str.split("\n");
        strarr.forEach((ele) => {
          if (arg.checkReg.test(ele)) {
            let str = ele;
            if (str.length > 100) {
              str = str.substring(0, 99) + "......";
            }
            singleObj.str.push(str);
          }
        });
        checkWordResult.checkResultArr.push(singleObj);
      }
    });
  } catch (e) {
    checkWordResult.err.push(e);
  }
  return checkWordResult;
}

module.exports = {
    checkword
  };