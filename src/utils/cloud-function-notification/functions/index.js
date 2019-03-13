const admin = require('firebase-admin');
const functions = require('firebase-functions');

const dispatchNotification = require('./dispatchNotification');

admin.initializeApp(functions.config().firebase);

exports.dispatchNotification = functions.https.onRequest(dispatchNotification);