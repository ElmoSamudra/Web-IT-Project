const sgMail = require('@sendgrid/mail')
//Authenticating with mail service to send emails from ...@eldarkurmakaev.com
const sendgridApiKey = "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"
sgMail.setApiKey(sendgridApiKey)

//Send email upon registration and by user request
const sendVerificationEmail = async (serverUrl) =>{
    try{
        let url =  serverUrl + "/verification-management/verifyEmail/"+ account.emailVerificationToken
        await sgMail.send({
            to: account.email,
            from: 'verification@eldarkurmakaev.com',
            subject: 'Verification email for ' + account.name,
            text: "Click this link to verify account: " + url
        })

        console.log(url)

    }catch (e) {
        console.log(e);
    }

}

module.exports = {
    sendVerificationEmail
};







