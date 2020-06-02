const path = require('path');


// 获取本地ip
function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

// 获取静态资源地址
function getAssetPath( options, filePath) {
  return options.assetsDir
  ? path.posix.join(options.assetsDir, filePath)
  : filePath
}

module.exports = {
  LOCAL_IP: getIPAddress(),
  getAssetPath
}