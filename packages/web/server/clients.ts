import { SolapiMessageService } from "solapi";

const SMS_API_KEY = `${process.env.SOLAPI_API_KEY}`;
const SMS_SECRET_KEY = `${process.env.SOLAPI_API_SECRET}`;

export const messageService = new SolapiMessageService(
  SMS_API_KEY,
  SMS_SECRET_KEY,
);
