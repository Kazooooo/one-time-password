import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as libphonenumber from "google-libphonenumber";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();;

const createUser = functions.https.onRequest((req, res) => {
  // Verify the user provided a phone
  if (!req.body.phone) {
    res.status(422).send({ error: "Bad Input" });
  } else {
    // Format the phone number to remove dashes and parens
    const number = phoneUtil.parseAndKeepRawInput(String(req.body.phone), "JP");
    const phone = phoneUtil.format(number, libphonenumber.PhoneNumberFormat.E164);

    // Create a new account using that phone number
    admin
      .auth()
      .createUser({ uid: phone })
      .then((user) => res.send(user))
      .catch((err) => res.status(422).send({ error: err }));

    // Respond to the user request, saying the account was made
  }
});

export default createUser;
