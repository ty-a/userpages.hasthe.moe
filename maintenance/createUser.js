#!/usr/bin/env node
const argv = require('yargs')
  .usage('Usage: node $0 -user [name] -password [password]')
  .demandOption(['user', 'password'])
  .argv;
var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/db.sqlite3', function(err) {
  if(err) {
    console.log("Unable to open database. Please check file permissions.");
    console.error(err);
    process.exit(1);
  }
});

var dbFunctions = require('../includes/db.js')(db);

dbFunctions.createUser(null, argv.user, argv.password, function(status, message) {
  if(status) {
    console.log("User created successfully!");
  } else {
    console.log("Unable to create user. Reason given was: " + message.message);
  }
});
