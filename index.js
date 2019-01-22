const args = require("yargs")
  .usage('Usage: index.js /path/to/emailList.csv "January 2018"')
  .demandCommand(2).argv;
const path = require("path");
const fs = require("fs");
const csv = require("csvtojson");
const csvFilePath = path.resolve(args._[0]);
const editionName = args._[1];

csv()
  .fromFile(csvFilePath)
  .then(json => {
    var people = json.filter(person => {
      person["E-Letter"].length > 0 && person["Email Address"].length > 0 && person["Dues Code"].length > 0;
    });
    var peopleToReceiveTheNewsletter = json.filter(person => {
      return person["E-Letter"].toLowerCase() == "email";
    });

    var partitionedPeople = peopleToReceiveTheNewsletter.reduce((accum, person) => {
      var year = parseInt(person["Dues Code"]);

      if (accum[year] == undefined) {
        accum[year] = [];
      }

      accum[year].push(person["Email Address"]);

      return accum;
    }, {});

    var messages = Object.entries(partitionedPeople).forEach(entry => {
      var year = entry[0];
      var emails = entry[1];

      console.log(year);
      console.log("");
      emails.forEach(email => {
        console.log(email + ",");
      });

      var emailTitle = `${editionName} Edition of the DWDWRA Newsletter`;

      var emailBody = `
Hello!

Your copy of the ${editionName} Edition of the DWDWRA Newsletter is attached.

Your membership dues are paid through ${year}.

As always, send me an email if you'd like anything added to the next edition of the newsletter.

Best,
Cody Sehl
Webmaster & Newsletter Editor
`;
      console.log("\nTitle: " + emailTitle);

      console.log(emailBody);

      console.log("----------------------------------------------");
      console.log("\n\n");
    });
  });
