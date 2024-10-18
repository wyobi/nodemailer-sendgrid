import { name, version } from "../package.json";
import { MailService } from "@sendgrid/mail";

import {
  readableStreamToString,
  isDefined,
  mapStringOrAddress,
} from "./helpers";
import type {
  SendCallback,
  Mail,
  AttachmentData,
  MailDataRequired,
  MailMessage,
} from "./types";
import { SendGridTransportBase } from "./base";

type SendGridTransportOptions = {
  apiKey?: string;
};

class SendGridTransport extends SendGridTransportBase {
  options: SendGridTransportOptions;
  name: string;
  version: string;
  private sgMail = new MailService();
  constructor(options: SendGridTransportOptions) {
    super();
    this.options = options ?? {};
    this.name = name;
    this.version = version;
    if (options.apiKey) {
      this.sgMail.setApiKey(options.apiKey);
    }
  }

  async send(mail: MailMessage, callback: SendCallback<any>) {
    try {
      const msg = await new Promise((resolve, reject) => {
        mail.normalize((err, _source) => {
          if (err) {
            return reject(err);
          }
          
          const msg: Partial<MailDataRequired> = {};
          const source = _source ?? {};
          Object.keys(source ?? {}).forEach((key) => {
            switch (key) {
              case "subject":
              case "text":
              case "html":
                msg[key] = source[key] as any;
                break;
              case "from":
              case "replyTo":
                msg[key] = [source[key] ?? []]
                  .flat()
                  .map(mapStringOrAddress)
                  .shift();
                break;
              case "to":
              case "cc":
              case "bcc":
                msg[key] = [source[key] ?? []].flat().map(mapStringOrAddress);
                break;
              case "attachments":
                this.handleAttachments(source, msg);
                break;
              case "alternatives":
                this.handleAlternatives(source, msg);
                break;
              case "icalEvent":
                {
                  let attachment: AttachmentData = {
                    content: readableStreamToString(
                      (source.icalEvent as Mail.IcalAttachment).content ?? ""
                    ),
                    filename:
                      (source.icalEvent as Mail.IcalAttachment).filename ||
                      "invite.ics",
                    type: "application/ics",
                    disposition: "attachment",
                  };
                  msg.attachments = (msg.attachments ?? []).concat(attachment);
                }
                break;
              case "watchHtml":
                {
                  let alternative = {
                    content: source.watchHtml,
                    type: "text/watch-html",
                  };
                  msg.content = (msg.content ?? []).concat(alternative as any);
                }
                break;
              case "normalizedHeaders":
                /*
                            const headers = msg.headers || {};
                            Object.keys(source.normalizedHeaders || {}).forEach(header => {
                                headers[header] = source.normalizedHeaders[header];
                            });
    
                            msg.headers = headers*/
                break;
              case "messageId":
                msg.headers = msg.headers ?? {};
                msg.headers["message-id"] = source.messageId!;
                break;
              default:
                (msg as any)[key] = (source as any)[key];
            }
          });
    
          if (msg?.content?.length) {
            if (msg.text) {
              msg.content.unshift({ type: "text/plain", value: msg.text });
              delete msg.text;
            }
            if (msg.html) {
              msg.content.unshift({ type: "text/html", value: msg.html });
              delete msg.html;
            }
          }

          resolve(msg);
        });
      })

      return await this.sgMail.send(msg as MailDataRequired, callback as any);
    }
    catch(err) {
      if(callback) {
        callback(err as Error | null, null);
      }
      else {
        throw err;
      }
    }
  }
  
  private handleAlternatives(
    source: Mail.Options,
    msg: Partial<MailDataRequired>
  ) {
    if (!source.alternatives) return;
    const alternatives = source.alternatives.map((entry) => {
      const alternative = {
        value: readableStreamToString(entry.content ?? ""),
        type: entry.contentType!,
      };
      return alternative;
    });

    msg.content = (msg.content ?? []).concat(alternatives);
  }

  private handleAttachments(
    source: Mail.Options,
    msg: Partial<MailDataRequired>
  ) {
    const attachments = (source.attachments ?? [])
      .map((entry) => {
        if (!entry.content || !entry.filename) return;
        const attachment: AttachmentData = {
          content: readableStreamToString(entry.content),
          filename: entry.filename,
          type: entry.contentType,
          disposition: "attachment",
        };
        if (entry.cid) {
          attachment.contentId = entry.cid;
          attachment.disposition = "inline";
        }
        return attachment;
      })
      .filter(isDefined);

    msg.attachments = (msg.attachments ?? []).concat(attachments);
  }
}

export const createSendGridTransport = (options: SendGridTransportOptions) =>
  new SendGridTransport(options);

export default createSendGridTransport;
