//Needs consultation
//How to substitue account in lines 147 - 153

const sinon = require('sinon')
const expect = require('chai').expect;

const Account = require ('../../models/account')
const controllers = require('../../controllers/accountController')

describe('testing updateMe() function', ()=> {
    const sandbox = sinon.createSandbox()
    after(async ()=>{
            sandbox.restore()
        }
    )

    it('test with correct arguments ->updateMe() should return new account information', async () =>  {
        const fake = sinon.fake()
        const req = {
            body: {
                name:"Michael7777",
                surname: "Jordan",
                password: "123456789",
                email:"jordanm777@gmail.com"
            }
        }
        let statusCodeX

        const res = {
            send: fake,
            status: (statusCode)=> {
                statusCodeX = statusCode
                return  {
                    send: fake
                }
            }


        }

        const updates = Object.keys(req.body)
        const allowedUpdates = ["name", "surname", "email", "password" ]
        const isValidOperation = updates.every((update)=>{
            return allowedUpdates.includes(update)
        })


        sandbox.replace(Account, 'create', (obj) =>{

            return Promise.resolve( {...obj
            })
        })

        await controllers.updateMe(req, res)
        const result = fake.lastCall.lastArg
        expect(isValidOperation).to.equal(true)
    })
})
