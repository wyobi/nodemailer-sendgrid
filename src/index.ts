import packageValues from '../package.json';
import { setApiKey, send as _send } from '@sendgrid/mail';

import { readableStreamToString, isDefined, mapStringOrAddress } from './helpers';
import type { SendCallback, Mail, AttachmentData, MailDataRequired,MailMessage } from './types';
import  { SendGridTransportBase } from "./base";

type SendGridTransportOptions = {
    apiKey?:string
}


class SendGridTransport extends SendGridTransportBase {
    options: SendGridTransportOptions;
    name: string;
    version: string;
    constructor(options:SendGridTransportOptions) {
        super()
        this.options = options || {};
        this.name = packageValues.name;
        this.version = packageValues.version;
        if (options.apiKey) {
            setApiKey(options.apiKey);
        }
    }

    async send(mail: MailMessage, callback: SendCallback<any>) {
        mail.normalize((err, source) => {
            if (err) {
                return callback(err,  null);
            }


            const wow = source ?? {}

            const msg : Partial<MailDataRequired>= {};
            Object.keys(wow || {}).forEach(key => {
                switch (key) {
                    case 'subject':
                    case 'text':
                    case 'html':
                        msg[key] = wow[key] as any;
                        break;
                    case 'from':
                    case 'replyTo':
                        msg[key] = [(wow[key] ?? [])].flat().map(mapStringOrAddress)
                            .shift();
                        break;
                    case 'to':
                    case 'cc':
                    case 'bcc':
                        msg[key] = [(wow[key] ?? [])].flat().map(mapStringOrAddress);
                        break;
                    case 'attachments':
                        this.handleAttachments(wow, msg);
                        break;
                    case 'alternatives':
                        this.handleAlternatives(wow, msg);
                        break;
                    case 'icalEvent':
                        {

                            let attachment : AttachmentData = {
                                content: readableStreamToString((wow.icalEvent as Mail.IcalAttachment).content ?? "") ,
                                filename: (wow.icalEvent as Mail.IcalAttachment).filename || 'invite.ics',
                                type: 'application/ics',
                                disposition: 'attachment'
                            };
                            msg.attachments = (msg.attachments ?? []).concat(attachment);
                        }
                        break;
                    case 'watchHtml':
                        {
                            let alternative = {
                                content: wow.watchHtml,
                                type: 'text/watch-html'
                            };
                            msg.content = (msg.content ?? []).concat(alternative as any);
                        }
                        break;
                    case 'normalizedHeaders':
                        /*
                        const headers = msg.headers || {};
                        Object.keys(wow.normalizedHeaders || {}).forEach(header => {
                            headers[header] = wow.normalizedHeaders[header];
                        });

                         msg.headers = headers*/
                        break;
                    case 'messageId':
                        msg.headers = msg.headers || {};
                        msg.headers['message-id'] = wow.messageId!;
                        break;
                    default:
                        (msg as any)[key] = (wow as any)[key];
                }
            });

            if (msg.content && msg.content.length) {
                if (msg.text) {
                    msg.content.unshift({ type: 'text/plain', value: msg.text });
                    delete msg.text;
                }
                if (msg.html) {
                    msg.content.unshift({ type: 'text/html', value: msg.html });
                    delete msg.html;
                }
            }

            _send(msg as MailDataRequired, callback  as any);
        });
    }
    private handleAlternatives(wow: Mail.Options, msg: Partial<MailDataRequired>) {
        
            if (!wow.alternatives) return
            let alternatives = wow.alternatives.map(entry => {
                let alternative = {
                    value: readableStreamToString(entry.content ??""),
                    type: entry.contentType!
                };
                return alternative;
            });

            msg.content = (msg.content ?? []).concat(alternatives);
        
    }

    private handleAttachments(wow: Mail.Options, msg: Partial<MailDataRequired>) {
        let attachments = (wow.attachments ?? []).map(entry => {
            if (!entry.content || !entry.filename) return;
            let attachment: AttachmentData = {
                content: readableStreamToString(entry.content),
                filename: entry.filename,
                type: entry.contentType,
                disposition: 'attachment'
            };
            if (entry.cid) {
                attachment.contentId = entry.cid;
                attachment.disposition = 'inline';
            }
            return attachment;
        }).filter(isDefined);

        msg.attachments = (msg.attachments ?? []).concat(attachments);
    }

}

export const createSendGridTransport =  (options: SendGridTransportOptions) => new SendGridTransport(options);

export default createSendGridTransport
