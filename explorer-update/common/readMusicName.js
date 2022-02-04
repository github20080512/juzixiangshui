var fs = require("fs");
function readMusic(val) {
    let arrFiles = [];
    const files = fs.readdirSync(val);
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
   
      const stat = fs.lstatSync(val + "\\" + item);
      if (stat.isDirectory() === true) {
        arrFiles = arrFiles.concat(readMusic(val + "\\" + item));
      } else {
        var reg = /^.*\.mp3$/;
        if (reg.test(item) ) {
       
          arrFiles.push(val + "\\" + item);
        }
      }
    }
    return arrFiles;
  }

  module.exports = {
    readMusic
  };