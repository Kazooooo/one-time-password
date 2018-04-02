import * as twilio from "twilio";
import { ACCOUNT_SID, AUTH_TOKEN } from "../constants/secure/twilio";

export default twilio(ACCOUNT_SID, AUTH_TOKEN);
