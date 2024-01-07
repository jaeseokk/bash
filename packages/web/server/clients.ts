import { SolapiMessageService } from "solapi";
import { createClient } from "@supabase/supabase-js";

const SMS_API_KEY = `${process.env.SOLAPI_API_KEY}`;
const SMS_SECRET_KEY = `${process.env.SOLAPI_API_SECRET}`;

export const messageService = new SolapiMessageService(
  SMS_API_KEY,
  SMS_SECRET_KEY,
);

const SUPABASE_URL = `${process.env.SUPABASE_URL}`;
const SUPABASE_KEY = `${process.env.SUPABASE_KEY}`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
