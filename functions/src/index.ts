import * as admin from "firebase-admin";
import createUser from "./createUser";
import serviceAccount from "./service_account";
import requestOneTimePassword from "./requestOneTimePassword";
import verifyOneTimePassword from "./verifyOneTimePassword";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://one-time-password-db070.firebaseio.com",
});

export { createUser, requestOneTimePassword, verifyOneTimePassword };
