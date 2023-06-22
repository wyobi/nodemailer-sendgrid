import type { Transport } from "nodemailer";
import { SendCallback, MailMessage } from "./types";

export abstract class SendGridTransportBase<T = any> implements Transport<T> {
  abstract name: string;
  abstract version: string;

  abstract send(mail: MailMessage<T>, callback: SendCallback<T>): void;

  verify?(callback: (err: Error | null, success: true) => void): void;
  verify?(): Promise<true>;

  close?(): void;
}
