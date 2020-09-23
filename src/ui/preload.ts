/*
Copyright 2020 Southern California Edison Company

ALL RIGHTS RESERVED
*/

// pulling node.js integration for remote controll
// reference: https://electronjs.org/docs/tutorial/securitys
let ourProcess = process;
process.once('loaded', function() {
  global.process = ourProcess;
});
