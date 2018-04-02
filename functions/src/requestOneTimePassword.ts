import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as libphonenumber from "google-libphonenumber";
import twilio from "./modules/twilio";
import { PHONE_NUMBER } from "./constants/secure/twilio";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();;

const requestOneTimePassword = functions.https.onRequest((req, res) => {
  if (!req.body.phone) {
    res.status(422).send({ error: "You must provide a phone number" });
  } else {
    const number = phoneUtil.parseAndKeepRawInput(String(req.body.phone), "JP");
    const phone = phoneUtil.format(number, libphonenumber.PhoneNumberFormat.E164);

    admin
      .auth()
      .getUser(phone)
      .then((userRecord) => {
        const code = Math.floor(Math.random() * 8999 + 1000);

        twilio.messages
          .create({
            body: `Your code is ${code}.`,
            to: phone,
            from: PHONE_NUMBER,
          })
          .then(() => {
            admin
              .database()
              .ref("users/" + phone)
              .update({ code: code, codeValid: true }, () => {
                res.send({ success: true });
              });
          })
          .catch((err) => {
            res.status(500).send({ error: err });
          });
      })
      .catch((err) => {
        // res.status(422).send({ error: "User not found" });
        res.status(422).send({ error: err });
      });
  }
});

export default requestOneTimePassword;
