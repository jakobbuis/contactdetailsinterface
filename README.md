# Contactdetailsinterface
Website for quickly discovering contact details of members of De Bolk. This is deployed in production on [www.debolk.nl/contactgegevens](http://www.debolk.nl/contactgegevens). Access to the data requires a stable connection to the internal network of De Bolk.

# How does this work
This project is a Javascript-based single page application. It retrieves data from both [people.i.bolkhuis.nl](http://people.i.bolkhuis.nl) and [operculum.i.bolkhuis.nl](http://operculum.i.bolkhuis.nl). It uses [bower](http://bower.io/), [zepto.js](http://zeptojs.com/) and [handlebars.js](http://handlebarsjs.com/).

# Installation
1. Clone the repository
1. Copy `config.example.js` to `config.js` and fill in the details. You'll need to get valid credentials from [prism.i.bolkhuis.nl](http://prism.i.bolkhuis.nl). Ask the ICTcom to generate these for you.
1. Open `index.html` in your browser.

# License
Copyright 2015 [Jakob Buis](http://www.jakobbuis.com). This version of Contactdetailsinterface is distributed under the GNU GPL v3 license, the full text of which is included in the LICENSE file.
