const expect = require('chai').expect;
const supertest = require('supertest')
const app = require("../../app")
const Account = require('../../models/account')

let regData = {
    surname: "TestSurname",
    name: "Test123",
    password: "req.body.password",
    email: "Testd2343432@gmail.com"

}

let logData={
    password: "req.body.password",
    email: "Testd2343432@gmail.com"
}

let testToken;

describe("login() integration test", ()=>{

    beforeEach(async()=>{
        try {
            const newAccount = await Account.create(regData)
            testToken = await newAccount.generateAuthToken()

        }catch (e) {
            const accountTest = await Account.findOne({email: regData.email})
            testToken = await accountTest.generateAuthToken()
        }
    })

        it("login() function with correct arguments ->" +
            "should return token and account information", async ()=>{

            const res = await supertest(app).post('/account-management/accounts/login').send(
                logData
            )
            expect(res.status).to.equal(200)
            expect(res.type).to.equal('application/json')
            expect(res.body).to.property('account')
            expect(res.body).to.property('token')
        })
    }

)
