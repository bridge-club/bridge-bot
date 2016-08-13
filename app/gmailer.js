const fs = require('fs');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const btoa = require('btoa');
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
let messageObj= '';

class Gmailer {  

  static sendMessage(credentials, clientSecret) {
    return new Promise(function(resolve, reject) {
      authorize(JSON.parse(credentials), JSON.parse(clientSecret), sendEmail);
      resolve();
    });
  }

  static buildMessage(emailMessage) {
    return new Promise(function(resolve, reject) {
      messageObj =  { 
        headers: {
          'To': emailMessage.recipients,
          // 'CC': 'someone else',
          'BCC': process.env.EMAIL,
          'From': 'Bridge Bot <bridge.club.bot@gmail.com>',
          'Subject': emailMessage.subject,
          'Content-Type': 'text/html; charset=utf-8; format=flowed',
        },
        messageBody: emailMessage.body
      };
      resolve();
    });
  }
}

const authorize = (token, credentials, callback) => {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth2Client.credentials = token;
  callback(oauth2Client, messageObj);
};

const sendEmail = (auth, messageObj, callback) => {
  const gmail = google.gmail('v1');
  const cb = callback || '';
  let email = '';
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
};

module.exports = Gmailer;
