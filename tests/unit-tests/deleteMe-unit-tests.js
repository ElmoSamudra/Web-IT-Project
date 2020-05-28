//Needs consultation

const sinon = require('sinon')
const expect = require('chai').expect;

const Account = require ('../../models/account')
const controllers = require('../../controllers/accountController')
describe('testing deleteMe() function', ()=> {
    const sandbox = sinon.createSandbox()
    after(async ()=>{
            sandbox.restore()
        }
    )

    it('test with correct arguments ->deleteMe() should return old account information', async () =>  {
        const fake = sinon.fake()
            const req = {
                account: {
                    remove:  fake
                }
            }

            res = {
                send: ()=>{
                }
            }

        await controllers.deleteMe(req, res)
        expect(fake.callCount).to.equal(1);


    })
})