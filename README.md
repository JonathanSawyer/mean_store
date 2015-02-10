[![Build Status](https://travis-ci.org/juunas11/mean_store.svg?branch=master)](https://travis-ci.org/juunas11/mean_store)
[![Sauce Test Status](https://saucelabs.com/buildstatus/juunas11)](https://saucelabs.com/u/juunas11)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/juunas11.svg)](https://saucelabs.com/u/juunas11)

# MEAN store
A simple web store built on the MEAN stack to study best practices with MEAN development.

Introduction video: [Youtube](http://youtu.be/jdmERNBQ7es)

## Building
To run the server you will need to have Node.js + NPM + Bower installed, as well as have a MongoDB available.

Run `npm install` and `bower install` to install the dependencies.

Then you can run `node .` to start the server. There is also a Nodemon configuration for running it with Nodemon.

## Testing
I used Gulp as my task runner, it should be installed with `npm install -g gulp`.

To run end-to-end tests, you must first execute `node_modules\.bin\webdriver-manager update` (on Windows). Then running `gulp e2e-test` will execute them in Chrome.

To run all tests, run `gulp test`.

`gulp auto` will automatically build and validate files.
