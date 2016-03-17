var Gmailer = function() {  
  var fs = require('fs');
  var google = require('googleapis');
  var googleAuth = require('google-auth-library');
  var btoa = require('btoa');

  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];

  var messageObj;

  this.sendMessage = function(credentials, clientSecret){
    console.log('1');
    return new Promise(function(resolve, reject) {
      authorize(JSON.parse(credentials), JSON.parse(clientSecret), sendEmail);
      resolve();
    });
  }

  this.buildMessage = function(emailMessage) {
        console.log('2');
    return new Promise(function(resolve, reject) {
      messageObj =  { headers: {
                      'To': emailMessage.recipients,
                      // 'CC': 'someone else',
                      // 'BCC': 'someone secret',
                      'From': 'BRIDGE BOT <bridge.club.bot@gmail.com>',
                      'Subject': emailMessage.subject,
                      'Content-Type': 'text/html; charset=utf-8; format=flowed',
                      'Content-Transfer-Encoding': 'quoted-printable'
                      },
                    messageBody: emailMessage.body
                    };
      resolve();
    });
  }

  function authorize(token, credentials, callback) {    
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    oauth2Client.credentials = token;
    callback(oauth2Client, messageObj);
  }

  function sendEmail(auth, messageObj, callback) {
        console.log('4');
    var callback = callback || '';
    var email = '';
    var gmail = google.gmail('v1');
    for(var header in messageObj.headers) {
      email += header += ": "+messageObj.headers[header]+"\r\n";
    }
    email += "\r\n" + messageObj.messageBody;
    console.log('email: ', email, "\n");
    gmail.users.messages.send({
      userId: 'me',
      auth: auth,
      resource: {
        raw: btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
      }
    });
  }
};

module.exports = Gmailer;