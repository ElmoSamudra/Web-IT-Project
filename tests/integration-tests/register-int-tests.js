const expect = require('chai').expect;
const supertest = require('supertest')
const app = require("../../app")
const Account = require('../../models/account')

const emailTest = "eedffwrer@gmail.com"

describe("register() integration test", ()=>{

    beforeEach(async()=>{
        try {
            let promiseGet = await Account.findOneAndRemove({email:emailTest})

        }catch (e) {

        }
    })

    it("register() function with correct arguments ->" +
        "should return token and newAccount information", async ()=>{
            const res = await supertest(app).post('/account-management/registerAccount').send(
                {
                    name:"Michael",
                    surname: "Jordan",
                    password: "123456789",
                    email: emailTest
                }
            )
            expect(res.status).to.equal(201)
            expect(res.type).to.equal('application/json')
            expect(res.body).to.property('newAccount')
            expect(res.body).to.property('token')
    })
    }

)
