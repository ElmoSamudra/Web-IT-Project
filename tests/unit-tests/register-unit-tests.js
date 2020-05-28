const sinon = require('sinon')
const expect = require('chai').expect;

const Account = require ('../../models/account')
const controllers = require('../../controllers/accountController')

describe('testing register() function', ()=> {
    const sandbox = sinon.createSandbox()
    after(async ()=>{
            sandbox.restore()
        }
    )

        it('test with correct arguments ->register() should return account and token', async () =>  {
            const fake = sinon.fake()
            const req = {
                body: {
                    name:"Michael",
                    surname: "Jordan",
                    password: "123456789",
                    email:"jordanm@gmail.com"
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

            sandbox.replace(Account, 'create', (obj) =>{

                return Promise.resolve( {...obj, generateAuthToken:()=>{
                    return Promise.resolve({token:"a"})
                    }})
            })




            await controllers.register(req, res)
            //expect(statusCodeX).to.equal(201)


            const result = fake.lastCall.lastArg

            console.log("***********************&&&&&^^^^^^^")
            console.log(result)
            expect(result).to.have.property("newAccount")
            expect(result.token).to.deep.equal({token:"a"})




        })
    })