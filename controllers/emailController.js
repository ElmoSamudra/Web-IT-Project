const sgMail = require('@sendgrid/mail')

const sendgridApiKey = "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"
sgMail.setApiKey(sendgridApiKey)


const sendVerificationEmail = async (account) =>{

    try{
        let url = "http://localhost:3000/verification-management/verifyEmail/"+ account.emailVerificationToken
        await sgMail.send({
            to: account.email,
            from: 'verification@eldarkurmakaev.com',
            subject: 'Verification email for ' + account.name,
            text: "Click this link to verify account: " + url
        })

    }catch (e) {
        console.log(e);
    }

}

module.exports = {
    sendVerificationEmail
};







