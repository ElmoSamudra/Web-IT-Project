const expect = require('chai').expect;
const supertest = require('supertest')
const app = require("../../app")
const Account = require('../../models/account')

let regData = {
    name: "Testname",
    surname: "TestSurname",
    password: "req.body.password",
    email: "Testd2343432@gmail.com"

}

let testToken

describe("deleteMe() integration test", ()=>{

        beforeEach(async()=>{
            try {
                const newAccount = await Account.create(regData)
                testToken = await newAccount.generateAuthToken()

            }catch (e) {
                const accountTest = await Account.findOne({email: regData.email})
                testToken = await accountTest.generateAuthToken()
            }
        })

        it("deleteMe() integration function with correct arguments ->" +
            "should delete account", async ()=>{
            const res = await supertest(app).delete('/account-management/accounts/me').set('Authorization', testToken).send()
            expect(res.type).to.equal('application/json')
            expect(res.body).to.property('_id')
        })
    }
)
