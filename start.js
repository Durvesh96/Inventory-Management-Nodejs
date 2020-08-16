const app = require("./app.js");

const myArgs = process.argv.slice(2);

let country = 0;
let Passport = 0;
let mask = 0;
let gloves = 0;

if (myArgs.length === 4) {
    country = myArgs[0];
    Passport = myArgs[1];
    gloves = myArgs[2];
    mask = myArgs[3];
}
else {
    country = myArgs[0];
    gloves = myArgs[1];
    mask = myArgs[2];
}

const data = app.calculateTotalPrice(country, Passport, gloves, mask);

console.log(data);