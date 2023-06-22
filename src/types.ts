import type { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import type { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import type MailMessage from "nodemailer/lib/mailer/mail-message";

import type Mail from "nodemailer/lib/mailer";

export type SendCallback<T> = (err: Error | null, info: T) => void;

export { MailDataRequired, AttachmentData, Mail, MailMessage };
