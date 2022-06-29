let admin = require("firebase-admin");
let serviceAccount = require("../db/session-5d056-firebase-adminsdk-wzwvn-c43db2e366.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;