//This one is done


const sinon = require('sinon')
const expect = require('chai').expect;

const Account = require ('../../models/account')
const controllers = require('../../controllers/accountController')

describe('testing getAllAccounts() function', ()=> {
    const sandbox = sinon.createSandbox()
    after(async ()=>{
            sandbox.restore()
        }
    )

    it('test with correct arguments ->register() should return array of 3 accounts', async () =>  {
        const fake = sinon.fake()
        const req = {
            params: "me"
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

        allAccounts = [
            {
            "isAdmin": false,
            "isEmailVerified": false,
            "_id": "5ea03321364c324899fd51fb",
            "name": "TEST",
            "surname": "WAWM",
            "email": "ssamudra@student.unimelb.edu.au",
            "__v": 12
            },
            {
                "isAdmin": false,
                "isEmailVerified": false,
                "_id": "5ea03997ede34d58351122aa",
                "name": "Nathanael",
                "surname": "Yoewono",
                "email": "nathanael@gmail.com",
                "__v": 48
            }]

        sandbox.replace(Account, 'find', () =>{

            return Promise.resolve( {allAccounts
            })
        })

        await controllers.getAllAccounts(req, res)
        const result = fake.lastCall.lastArg
        expect(result.allAccounts).to.have.lengthOf(2)
    })
})
