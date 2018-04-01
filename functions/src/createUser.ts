import * as functions from "firebase-functions";

const createUser = functions.https.onRequest((req, res) => {
  res.send(req.body);
});

export default createUser;
