# ***************************
# ***************************
# **                       **
# **  B R I D G E   B O T  **
# **                       **
# ***************************
# ***************************

Automated email alerts using text files in Dropbox as a datastore and the Gmail API, (currently) built in Node.js.


## About

BRIDGE-BOT is an automated messaging system. It consumes a list of club members' names and email addresses (in JSON format) from a file in Dropbox. Every week it prepares an email - either to one member or all members - and then emails it using it's own Gmail account and the Gmail API (Google auth secrets are also read from JSON files in Dropbox). Hosted in Heroku, it uses a 'custom' Node buildpack (no web process) and the Heroku scheduler set to run a single process every hour. It then checks whether it needs to do anything, depending on the time of day and whether it has done anything that day, then either writes and sends a message, or shuts down. The bot is built and destroyed once every hour, so it reads and writes to another file in Dropbox to store the state of the application.

Current version is little more than a spike, but it works and is plenty good enough for our purposes.


## Get involved

If you can write code, feel free to contribute. If you want to make suggestions about functionality, those are also welcome.


## TODO: 

* Better testing.
* Design improvements / refactoring.
* More modularity - less hardcoded stuff and more config.
* Java (?) version. Just cuz I wanna.
* Twilio integration - members can report jobs that need doing via SMS and those on shift are notified.


## Prerequisites

* [NodeJS](https://nodejs.org/en/)
* [Heroku](http://www.heroku.com) account & [Heroku CLI toolbelt](https://toolbelt.heroku.com/) installed
* [Dropbox](https://www.dropbox.com/) account 
* [Dropbox access token](https://www.dropbox.com/developers) (stored in environment variables)
* [Gmail](https://www.gmail.com) account
* [Google Gmail API client_secret.json](https://console.developers.google.com/flows/enableapi?apiid=gmail&pli=1) (stored in your named Dropbox app folder)
* [Google gmail-node.js-quickstart.json](https://console.developers.google.com/flows/enableapi?apiid=gmail&pli=1) (stored in your named Dropbox app folder)
* members.json and bridge-bot.txt (see below) (stored in your named Dropbox app folder)
* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)


## Installation

``` git clone ``` this repo.
``` npm install ```

create a Heroku app:
``` heroku create <your-app-name> --buildpack https://github.com/forty9er/heroku-buildpack-nodejs ```
``` git push heroku master ```

set the BRIDGE_BOT_DROPBOX_ACCESS_TOKEN environment variable in your Heroku app.
** temporarily ** set an EMAIL environment variable, or edit lines 27 and 33 of bot.js to take a different variable/email address.
set the [Heroku scheduler](https://elements.heroku.com/addons/scheduler) to run ``` npm start ``` every hour - or as often as suits you.
optionally: set the timezone of your app in the CLI using the [TZ](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) format (ie. ``` heroku config:add TZ="Europe/London ```)


## File formats:

members.json:

```
{
  "members": [{
    "id": 1,
    "name": "Carla",
    "surname": "Azar",
    "email": "carla@azar.com"
  }, {
    "id": 2,
    "name": "Drumbo",
    "surname": "",
    "email": "drumbo@drums.com"
  }, {
    "id": 3,
    "name": "Chris",
    "surname": "Corsano",
    "email": "chris@cor.sano.com"
  }]
}
```

bridge-bot.txt (the "memory"):

```
{"currentMember":{"id":1,"name":"Drumbo","surname":"","email":"drumbo@drums.com"},"cleaningScheduled":true,"dayTracker":5}
```

*****************
*  E N J O Y !  *
*****************