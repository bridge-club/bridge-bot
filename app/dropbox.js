const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const Dropbox = function() {
    this.accessToken = process.env.BRIDGE_BOT_DROPBOX_ACCESS_TOKEN;
};

Dropbox.prototype.writeFile = function(fileNameToWrite, fileContentToWrite, async) {
  let result;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://content.dropboxapi.com/2/files/upload", async);
  xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
  xhr.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/" + fileNameToWrite + "\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}");
  xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");
  xhr.send(fileContentToWrite);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("file: " + fileNameToWrite + " has been written");
      console.log("file contents: " + fileContentToWrite + "\n");
      result = "OK";
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      console.log("There was a problem writing " + fileNameToWrite + "\n");
      result = "Error";
    }
  };
  return result;
};

Dropbox.prototype.readFile = function(fileNameToRead, async) {
    const xhr = new XMLHttpRequest();
    let result;
    xhr.open("POST", "https://content.dropboxapi.com/2/files/download", async);
    xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
    xhr.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/" + fileNameToRead + "\"}");
    xhr.send();

    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("file: " + fileNameToRead + " has been read.");
      console.log("file contents: " + xhr.responseText + "\n");
      result = xhr.responseText;
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      console.log("There was a problem reading " + fileNameToRead + "\n");
    }
 return result;
};

module.exports = Dropbox;
