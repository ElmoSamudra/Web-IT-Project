//Needs consultation
//How to go about line 95

const sinon = require('sinon')
const expect = require('chai').expect;

const Account = require ('../../models/account')
const controllers = require('../../controllers/accountController')

describe('testing logout() function', ()=> {
    const sandbox = sinon.createSandbox()
    after(async ()=>{
            sandbox.restore()
        }
    )

    it('test with correct arguments ->login() should remove one token from array, lenght should be 2', async () =>  {
        const fake = sinon.fake()
        const req = {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWNlZGViY2VlMjMxMzI4MGNiZDY5MGMiLCJpYXQiOjE1OTA2MTU3NDB9.wG1ctXUfPETqbs5gh4DgUheQ9q6TAlqx5AvcYkFAjCM',
            account: {
                tokens:["test1", "test2" ,"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWNlZGViY2VlMjMxMzI4MGNiZDY5MGMiLCJpYXQiOjE1OTA2MTU3NDB9.wG1ctXUfPETqbs5gh4DgUheQ9q6TAlqx5AvcYkFAjCM"],
                save: fake
            }
        }


        req.account.tokens = req.account.tokens.filter((token)=>{
            return token !== req.token
        })


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

        await controllers.logout(req, res)
        expect(req.account.tokens).to.have.lengthOf(2)

    })
})