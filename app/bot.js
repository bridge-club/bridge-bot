"use strict";

const Dropbox = require('./dropbox.js');
const Gmailer = require('./gmailer.js');
const Members = require('./members.js');

const dropbox = new Dropbox();
const gmailer = new Gmailer();
const members = new Members();

const date = new Date();
const weekday = date.getDay();
const hour = date.getHours();

const googleCredentials = dropbox.readFile("gmail-nodejs-quickstart.json", false);
const googleClientSecret = dropbox.readFile("client_secret.json", false);

const membersMap = dropbox.readFile("members.json", false);
members.getMemberList(membersMap);

const currentState = JSON.parse(dropbox.readFile("bridge-bot.txt", false)); 
const currentMember = currentState.currentMember;

let emailMessage;

const selectMessageContent = () => {
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

const getNextMember = () => {
  let nextMember;
  if (currentMember.id < members.memberList.length) {
    nextMember = members.memberList[currentMember.id];
  } else {
    nextMember = members.memberList[0];
  }
  currentState.currentMember = nextMember;
}

const toggleCleaningScheduled = () => {
  currentState.cleaningScheduled = !(currentState.cleaningScheduled);
}

const updateDropbox = () => {
  currentState.dayTracker = weekday;
  dropbox.writeFile("bridge-bot.txt", JSON.stringify(currentState), true);
}

const fullName = (currentMember) => {
  const name = currentMember.name;
  if (currentMember.surname !== "") {
    name += (" " + currentMember.surname);
  }
  return name;
}

const footer = () => {
  return "<br><br><p style=\"font-size:11px;\"><a href=\"https://github.com/bridge-club/bridge-bot\">Bridge-Bot is open source</a> and welcomes your feature suggestions and code contributions.</p>";
}

const itsMonday = () => {
  return (weekday === 1);
}

const afterTen = () => {
  return (hour >= 10);
}

const nothingDoneToday = () => {
  return (currentState.dayTracker !== weekday);
}

if (afterTen() && nothingDoneToday()) {  
  if (itsMonday()) {
    selectMessageContent().then(() => {
      gmailer.buildMessage(emailMessage).then(() => {
        gmailer.sendMessage(googleCredentials, googleClientSecret).then(() => {
          if (currentState.cleaningScheduled) {
              getNextMember();
          }
          toggleCleaningScheduled();
        });
      });
    });
  }
  updateDropbox();
}