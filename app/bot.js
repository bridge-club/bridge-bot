var Dropbox = require('./dropbox.js');
var Gmailer = require('./gmailer.js');
var Members = require('./members.js');

var dropbox = new Dropbox();
var gmailer = new Gmailer();
var members = new Members();

var date = new Date();
var weekday = date.getDay();
var hour = date.getHours();

var googleCredentials = dropbox.readFile("gmail-nodejs-quickstart.json", false);
var googleClientSecret = dropbox.readFile("client_secret.json", false);

var membersMap = dropbox.readFile("members.json", false);
members.getMemberList(membersMap);

var currentState = JSON.parse(dropbox.readFile("bridge-bot.txt", false)); 
var currentMember = currentState.currentMember;

var emailMessage;

function selectMessageContent() {
  return new Promise(function(resolve, reject) {
    if (currentState.cleaningScheduled) {
      emailMessage = {"recipients": members.getAllEmailAddresses(),
                      "subject": "Bridge club: " + fullName(currentMember) + " is cleaning this week.",
                      "body": fullName(currentMember) + " is cleaning this week.<br><br><br>Sincerely,<br><br>Botty McBotface" + footer()
                     };
    } else {
      emailMessage = {"recipients": members.getEmailAddressFor(currentMember.id -1),
                      "subject": "Bridge club: Your cleaning shift is coming up, " + currentMember.name + "!",
                      "body": "Your cleaning shift at the Bridge is coming up next week.<br><br>Please find time to do it with your bandmates within 7 days of next Monday.<br><br>If you need to buy cleaning supplies/toilet rolls etc. Graham should be able to reimburse you, might be worth a check this week to see what's already there so you can come prepared.<br><br><br>Sincerely,<br><br>Botty McBotface" + footer()
                     };
    }
  resolve();
  });  
}

function getNextMember() {
  var nextMember;
  if (currentMember.id < members.memberList.length) {
    nextMember = members.memberList[currentMember.id];
  } else {
    nextMember = members.memberList[0];
  }
  currentState.currentMember = nextMember;
}

function toggleCleaningScheduled() {
  currentState.cleaningScheduled = !(currentState.cleaningScheduled);
}

function updateDropbox() {
  currentState.dayTracker = weekday;
  dropbox.writeFile("bridge-bot.txt", JSON.stringify(currentState), true);
}

function fullName(currentMember) {
  var name = currentMember.name;
  if (currentMember.surname !== "") {
    name += (" " + currentMember.surname);
  }
  return name;
}

function footer() {
  return "<br><br><p style=\"font-size:11px;\"><a href=\"https://github.com/bridge-club/bridge-bot\">Bridge-Bot is open source</a> and welcomes your feature suggestions and code contributions.</p>";
}

function itsMonday() {
  return (weekday === 1);
}

function afterTen() {
  return (hour >= 10);
}

function nothingDoneToday() {
  return (currentState.dayTracker !== weekday);
}

if (afterTen() && nothingDoneToday()) {  
  if (itsMonday()) {
    selectMessageContent().then(function(){
      gmailer.buildMessage(emailMessage).then(function(){
        gmailer.sendMessage(googleCredentials, googleClientSecret).then(function(){
          if (currentState.cleaningScheduled) {
              getNextMember();
          }
          toggleCleaningScheduled();
        });
      });
    });
  updateDropbox(); 
}