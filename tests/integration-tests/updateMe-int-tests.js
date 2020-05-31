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

let updateData={
    surname: "UpdateN",
    name: "UpdateS",
    password: "Update2",
    email: "testd2343432@gmail.com"
}

let testToken;

describe("updateMe() integration test", ()=>{

        beforeEach(async()=>{
            try {
                const newAccount = await Account.create(regData)
                testToken = await newAccount.generateAuthToken()

            }catch (e) {
                const accountTest = await Account.findOne({email: regData.email})
                testToken = await accountTest.generateAuthToken()
            }
        })

        it("updateMe() function with correct arguments ->" +
            "should return code 200 and updated account information", async ()=>{

            const res = await supertest(app).patch("/account-management/accounts/me").set('Authorization', testToken).send(
                updateData
            )
            expect(res.status).to.equal(200)
            expect(res.type).to.equal('application/json')
            expect(res.body).to.property('_id')
            expect(res.body.email).to.equal(updateData.email)
            expect(res.body.surname).to.equal(updateData.surname)
            expect(res.body.name).to.equal(updateData.name)

        })
    }

)
