var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var Dropbox = function() {
    this.accessToken = process.env.BRIDGE_BOT_DROPBOX_ACCESS_TOKEN;
    this.fileData;
};

Dropbox.prototype.writeFile = function(fileNameToWrite, fileContentToWrite, async) {
  var result;
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://content.dropboxapi.com/2/files/upload", async);
  xhttp.setRequestHeader("Authorization", "Bearer " + this.accessToken);
  xhttp.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/" + fileNameToWrite + "\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}");
  xhttp.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");
  xhttp.send(fileContentToWrite);

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      console.log("file: " + fileNameToWrite + " has been written");
      console.log("file contents: " + fileContentToWrite + "\n");
      result = "OK"
    } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
      console.log("There was a problem writing " + fileNameToWrite + "\n");
      result = "Error"
    }
  };
  return result;
}

Dropbox.prototype.readFile = function(fileNameToRead, async) {
    var xhttp = new XMLHttpRequest();
    var result;
    xhttp.open("POST", "https://content.dropboxapi.com/2/files/download", async);
    xhttp.setRequestHeader("Authorization", "Bearer " + this.accessToken);
    xhttp.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/" + fileNameToRead + "\"}");
    xhttp.send();

    if (xhttp.readyState === 4 && xhttp.status === 200) {
      console.log("file: " + fileNameToRead + " has been read.");
      console.log("file contents: " + xhttp.responseText + "\n");
      result = xhttp.responseText;
    } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
      console.log("There was a problem reading " + fileNameToRead + "\n");
    }
 return result;
}

module.exports = Dropbox;