
//Needs consultation
//How to go about line 78 in accountControllers
const sinon = require('sinon')
const expect = require('chai').expect;

const Account = require ('../../models/account')
const controllers = require('../../controllers/accountController')

describe('testing login() function', ()=> {
    const sandbox = sinon.createSandbox()
    after(async ()=>{
            sandbox.restore()
        }
    )

    it('test with correct arguments ->login() should return account and token', async () =>  {
        const fake = sinon.fake()
        const req = {
            body: {
                email:"ekurmakaev@student.unimelb.edu.au",
                password: "123456789"
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

        accountObj = {
            account: {
                isAdmin: true,
                isEmailVerified: true,
                _id: "5eabebc5ff50740017d48253",
                name: "admin",
                surname: "admin",
                email: "ekurmakaev@student.unimelb.edu.au",
                __v: 36
            },
        }

        sandbox.replace(Account, 'findByCredentials', (obj) =>{

            return Promise.resolve( {...accountObj,
                generateAuthToken:()=>{
                    return Promise.resolve({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWFiZWJjNWZmNTA3NDAwMTdkNDgyNTMiLCJpYXQiOjE1OTA1ODE5Nzh9._IigJADeuaRJXI2HbeS8l2WN60wgmhmGDEtO1TOldjQ"})
                }
            })
        })

        await controllers.login(req, res)
        const result = fake.lastCall.lastArg
        expect(result).to.have.property("account")
        expect(result.token).to.deep.equal({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWFiZWJjNWZmNTA3NDAwMTdkNDgyNTMiLCJpYXQiOjE1OTA1ODE5Nzh9._IigJADeuaRJXI2HbeS8l2WN60wgmhmGDEtO1TOldjQ"})
    })
})