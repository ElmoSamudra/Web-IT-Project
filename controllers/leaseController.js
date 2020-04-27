const sgMail = require('@sendgrid/mail');
const sendgridApiKey = "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"
sgMail.setApiKey(sendgridApiKey);

const requestUpdateLease = async (req, res) => {
    const textReq = req.body.requestText;

    try{
        // send email to the user first
        await sgMail.send({
            to: req.account.email,
            from: 'verification@eldarkurmakaev.com',
            subject: 'Lease enquiries for ' + req.account.name,
            text: "<p>Thankyou for your enquiries. This is an automate response. One of Roommee's representative will contact you shortly. This would take around 1-2 business days. Thank you for your patience and have a nice day!<p>"
        });
        // send email to admin, answer the request manually through email 
        await sgMail.send({
            to: 'nyoewono@student.unimelb.edu.au',
            from: 'verification@eldarkurmakaev.com',
            subject: 'Lease enquiries for ' + req.account._id,
            text: textReq
        });
        res.send('Thankyou for your enquiries, please check your email');
    }catch (e) {
        console.log(e);
    }
}

module.exports = {
    requestUpdateLease,
}