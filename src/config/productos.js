let admin = require("firebase-admin");
let serviceAccount = require("../db/productosback-firebase-adminsdk-icons-f4eb478d57.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;