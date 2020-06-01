const sinon = require('sinon')
const expect = require('chai').expect;

const Account = require ('../../models/account')
const controllers = require('../../controllers/accountController')
const emailControllers = require('../../controllers/emailController')

describe('testing register() function', ()=> {
    const sandbox = sinon.createSandbox()
    after(async ()=>{
            sandbox.restore()
        }
    )

        it('test with correct arguments ->register() should return account and token', async () =>  {
            const fake = sinon.fake()
            const fakeEmail = sinon.spy()
            const req = {
                body: {
                    name:"Michael",
                    surname: "Jordan",
                    password: "123456789",
                    email:"jordanm@gmail.com"
                },
                serverUrl: "roomie.com"
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

            sandbox.replace(Account, 'create', (obj) =>{

                return Promise.resolve( {...obj, generateAuthToken:()=>{
                    return Promise.resolve({token:"a"})
                    }, generateEmailToken:()=>{
                        return Promise.resolve({emailToken: "a"})
                    }})
            })

            sandbox.replace(emailControllers, 'sendVerificationEmail', fakeEmail)

            await controllers.register(req, res)
            const result = fake.lastCall.lastArg
            expect(result).to.have.property("newAccount")
            expect(fakeEmail.args[0][0]).to.equal("roomie.com")
        })
    })