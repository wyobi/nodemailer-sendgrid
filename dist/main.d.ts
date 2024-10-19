import MailMessage from "nodemailer/lib/mailer/mail-message";
import { Transport } from "nodemailer";
type SendCallback<T> = (err: Error | null, info: T) => void;
declare abstract class SendGridTransportBase<T = any> implements Transport<T> {
    abstract name: string;
    abstract version: string;
    abstract send(mail: MailMessage<T>, callback: SendCallback<T>): void;
    verify?(callback: (err: Error | null, success: true) => void): void;
    verify?(): Promise<true>;
    close?(): void;
}
type SendGridTransportOptions = {
    apiKey?: string;
};
declare class SendGridTransport extends SendGridTransportBase {
    options: SendGridTransportOptions;
    name: string;
    version: string;
    constructor(options: SendGridTransportOptions);
    send(mail: MailMessage, callback: SendCallback<any>): Promise<[import("@sendgrid/mail").ClientResponse, {}] | undefined>;
}
export const createSendGridTransport: (options: SendGridTransportOptions) => SendGridTransport;
export default createSendGridTransport;

//# sourceMappingURL=main.d.ts.map
