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

let testToken;


describe("getAllAccounts() integration test", ()=>{


        beforeEach(async()=>{
            try {
                const newAccount = await Account.create(regData)
                testToken = await newAccount.generateAuthToken()

            }catch (e) {
                const accountTest = await Account.findOne({email: regData.email})
                testToken = await accountTest.generateAuthToken()
            }
        })

        it("getAllAccounts() function with correct arguments ->" +
            "should return array of accounts", async ()=>{

            const res = await supertest(app).get('/account-management/accounts').set('Authorization', testToken).send(
            )
            expect(res.status).to.equal(200)
            expect(res.type).to.equal('application/json')
        })
    }

)
