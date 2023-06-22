import type Mail from "nodemailer/lib/mailer";
import type { Readable } from "stream";

export const readableStreamToString = (
  value: string | Readable | Buffer
): string => {
  return Buffer.isBuffer(value) ? value.toString() : (value as string);
};
export const isDefined = <T>(value: T | undefined): value is T => {
  return typeof value !== "undefined";
};

export const mapStringOrAddress = (entry: string | Mail.Address) => {
  if (typeof entry == "string") return entry;

  return {
    name: entry.name,
    email: entry.address,
  };
};
