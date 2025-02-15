var $1hSWc$sendgridmail = require("@sendgrid/mail");


function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "createSendGridTransport", () => $af5f2ecd477d2761$export$242e68b76e230f1b);
$parcel$export(module.exports, "default", () => $af5f2ecd477d2761$export$2e2bcd8739ae039);
var $70edae2846236c84$exports = {};
$70edae2846236c84$exports = JSON.parse("{\"name\":\"nodemailer-sendgrid-create-transport\",\"version\":\"2.0.1\",\"description\":\"\",\"source\":\"src/index.ts\",\"main\":\"dist/main.js\",\"types\":\"dist/main.d.ts\",\"module\":\"dist/module.js\",\"scripts\":{\"watch\":\"parcel watch\",\"build\":\"parcel build\",\"example\":\"ts-node examples/mail.ts\"},\"keywords\":[\"nodemailer\",\"sendgrid\"],\"author\":\"Andris Reinman\",\"license\":\"MIT\",\"dependencies\":{\"@sendgrid/helpers\":\"^8.0.0\",\"@sendgrid/mail\":\"^8.1.4\"},\"devDependencies\":{\"@parcel/packager-ts\":\"2.13.3\",\"@parcel/transformer-typescript-types\":\"^2.13.3\",\"@types/nodemailer\":\"^6.4.16\",\"eslint-config-nodemailer\":\"^1.2.0\",\"nodemailer\":\"^6.9.15\",\"parcel\":\"^2.13.3\",\"ts-node\":\"^10.9.2\",\"typescript\":\">=5.6.3\"},\"engines\":{\"node\":\">= 12\"}}");



const $1ad61a74039295c2$export$e2bf61c61cea5a42 = (value)=>{
    return Buffer.isBuffer(value) ? value.toString() : value;
};
const $1ad61a74039295c2$export$4e62c701997796c1 = (value)=>{
    return typeof value !== "undefined";
};
const $1ad61a74039295c2$export$c10ebd12130bd752 = (entry)=>{
    if (typeof entry == "string") return entry;
    return {
        name: entry.name,
        email: entry.address
    };
};


class $498f358ee4abdb43$export$fbf60eb5c5bd4672 {
}


class $af5f2ecd477d2761$var$SendGridTransport extends (0, $498f358ee4abdb43$export$fbf60eb5c5bd4672) {
    constructor(options){
        super(), this.sgMail = new (0, $1hSWc$sendgridmail.MailService)();
        this.options = options !== null && options !== void 0 ? options : {};
        this.name = (0, $70edae2846236c84$exports.name);
        this.version = (0, $70edae2846236c84$exports.version);
        if (options.apiKey) this.sgMail.setApiKey(options.apiKey);
    }
    async send(mail, callback) {
        try {
            const msg = await new Promise((resolve, reject)=>{
                mail.normalize((err, _source)=>{
                    var _msg_content;
                    if (err) return reject(err);
                    const msg = {};
                    const source = _source !== null && _source !== void 0 ? _source : {};
                    Object.keys(source !== null && source !== void 0 ? source : {}).forEach((key)=>{
                        switch(key){
                            case "subject":
                            case "text":
                            case "html":
                                msg[key] = source[key];
                                break;
                            case "from":
                            case "replyTo":
                                var _source_key;
                                msg[key] = [
                                    (_source_key = source[key]) !== null && _source_key !== void 0 ? _source_key : []
                                ].flat().map((0, $1ad61a74039295c2$export$c10ebd12130bd752)).shift();
                                break;
                            case "to":
                            case "cc":
                            case "bcc":
                                var _source_key1;
                                msg[key] = [
                                    (_source_key1 = source[key]) !== null && _source_key1 !== void 0 ? _source_key1 : []
                                ].flat().map((0, $1ad61a74039295c2$export$c10ebd12130bd752));
                                break;
                            case "attachments":
                                this.handleAttachments(source, msg);
                                break;
                            case "alternatives":
                                this.handleAlternatives(source, msg);
                                break;
                            case "icalEvent":
                                {
                                    var _source_icalEvent_content;
                                    let attachment = {
                                        content: (0, $1ad61a74039295c2$export$e2bf61c61cea5a42)((_source_icalEvent_content = source.icalEvent.content) !== null && _source_icalEvent_content !== void 0 ? _source_icalEvent_content : ""),
                                        filename: source.icalEvent.filename || "invite.ics",
                                        type: "application/ics",
                                        disposition: "attachment"
                                    };
                                    var _msg_attachments;
                                    msg.attachments = ((_msg_attachments = msg.attachments) !== null && _msg_attachments !== void 0 ? _msg_attachments : []).concat(attachment);
                                }
                                break;
                            case "watchHtml":
                                {
                                    let alternative = {
                                        content: source.watchHtml,
                                        type: "text/watch-html"
                                    };
                                    var _msg_content;
                                    msg.content = ((_msg_content = msg.content) !== null && _msg_content !== void 0 ? _msg_content : []).concat(alternative);
                                }
                                break;
                            case "normalizedHeaders":
                                break;
                            case "messageId":
                                var _msg_headers;
                                msg.headers = (_msg_headers = msg.headers) !== null && _msg_headers !== void 0 ? _msg_headers : {};
                                msg.headers["message-id"] = source.messageId;
                                break;
                            default:
                                msg[key] = source[key];
                        }
                    });
                    if (msg === null || msg === void 0 ? void 0 : (_msg_content = msg.content) === null || _msg_content === void 0 ? void 0 : _msg_content.length) {
                        if (msg.text) {
                            msg.content.unshift({
                                type: "text/plain",
                                value: msg.text
                            });
                            delete msg.text;
                        }
                        if (msg.html) {
                            msg.content.unshift({
                                type: "text/html",
                                value: msg.html
                            });
                            delete msg.html;
                        }
                    }
                    resolve(msg);
                });
            });
            return await this.sgMail.send(msg, callback);
        } catch (err) {
            if (callback) callback(err, null);
            else throw err;
        }
    }
    handleAlternatives(source, msg) {
        if (!source.alternatives) return;
        const alternatives = source.alternatives.map((entry)=>{
            var _entry_content;
            const alternative = {
                value: (0, $1ad61a74039295c2$export$e2bf61c61cea5a42)((_entry_content = entry.content) !== null && _entry_content !== void 0 ? _entry_content : ""),
                type: entry.contentType
            };
            return alternative;
        });
        var _msg_content;
        msg.content = ((_msg_content = msg.content) !== null && _msg_content !== void 0 ? _msg_content : []).concat(alternatives);
    }
    handleAttachments(source, msg) {
        var _source_attachments;
        const attachments = ((_source_attachments = source.attachments) !== null && _source_attachments !== void 0 ? _source_attachments : []).map((entry)=>{
            if (!entry.content || !entry.filename) return;
            const attachment = {
                content: (0, $1ad61a74039295c2$export$e2bf61c61cea5a42)(entry.content),
                filename: entry.filename,
                type: entry.contentType,
                disposition: "attachment"
            };
            if (entry.cid) {
                attachment.contentId = entry.cid;
                attachment.disposition = "inline";
                attachment.toJSON = function() {
                    var d = {};
                    for(const k in this){
                        if (k === "toJSON") continue;
                        else if (k === "contentId") d["content_id"] = this[k];
                        else d[k] = this[k];
                    }
                    return d;
                };
            }
            return attachment;
        }).filter((0, $1ad61a74039295c2$export$4e62c701997796c1));
        var _msg_attachments;
        msg.attachments = ((_msg_attachments = msg.attachments) !== null && _msg_attachments !== void 0 ? _msg_attachments : []).concat(attachments);
    }
}
const $af5f2ecd477d2761$export$242e68b76e230f1b = (options)=>new $af5f2ecd477d2761$var$SendGridTransport(options);
var $af5f2ecd477d2761$export$2e2bcd8739ae039 = $af5f2ecd477d2761$export$242e68b76e230f1b;


//# sourceMappingURL=main.js.map
