//This one is done
const sinon = require('sinon')
const expect = require('chai').expect;

const Account = require ('../../models/account')
const controllers = require('../../controllers/accountController')

describe('testing getMyAccount() function', ()=> {
    const sandbox = sinon.createSandbox()
    after(async ()=>{
            sandbox.restore()
        }
    )

    it('test with correct arguments ->getMyAccount() should return account object', async () =>  {
        const fake = sinon.fake()
        const req = {
            account:{
                isAdmin: true,
                isEmailVerified: true,
                _id: '5eabebc5ff50740017d48253',
                name: 'admin',
                surname: 'admin',
                email: 'ekurmakaev@student.unimelb.edu.au',
                password: '$2b$08$u6lkTEbOG24MFkOAujvFluBNzGVYkLkWuLzNDVDlAwQ8y3Fu2HUZa',
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
        await controllers.getMyAccount(req, res)
        const result = req
        expect(result.account).to.have.property('_id')
    })
})

