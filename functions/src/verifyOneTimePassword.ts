import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as libphonenumber from "google-libphonenumber";
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const verifyOneTimePassword = functions.https.onRequest((req, res) => {
  if (!req.body.phone || !req.body.code) {
    res.status(422).send({});
  } else {
    const number = phoneUtil.parseAndKeepRawInput(String(req.body.phone), "JP");
    const phone = phoneUtil.format(number, libphonenumber.PhoneNumberFormat.E164);

    const code = parseInt(req.body.code);

    admin
      .auth()
      .getUser(phone)
      .then(() => {
        const ref = admin.database().ref("users/" + phone);
        ref.on("value", (snapshot) => {
          ref.off();
          const user = snapshot.val();
          if (user.code !== code || !user.codeValid) {
            res.status(422).send({ error: "Code not valid" });
          } else {
            ref.update({ codeValid: false });
            admin
              .auth()
              .createCustomToken(phone)
              .then((token) => res.send({ token }));
          }
        });
      })
      .catch((err) => res.status(422).send({ error: err }));
  }
});

export default verifyOneTimePassword;
