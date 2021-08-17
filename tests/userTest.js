const chai = require('chai');
const chaiHttp = require('chai-http');
let app  = require('../app');
const assert = chai.assert;
const sinon = require("sinon");
const axios = require('axios');
const Encryptor = require('../lib/encryption');
const Tokenization = require('../lib/token-config');
const { TEST_USER, TEST_PASS } = require('../constants');
const utils = require('../lib/utils');
const UserController = require('../controllers/userController');
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("User profile fetch test.", () => {
    afterEach(() => {
        sinon.restore();
     });

   it('test get user profile ', () => {
        const fake = sinon.replace(axios, 'get', sinon.fake.returns(global.Promise.resolve({ res: "ok", data: { name: "testuser" } })));
        UserController.getUserByName({username : "testuser"}).then(res => {
        assert.deepStrictEqual(res.name, "test")
        assert.strictEqual(fake.callCount,1); 
        });
    })

    it('test get user profile should fail', () => {
        const fake = sinon.replace(axios, 'get', sinon.fake.returns(global.Promise.reject(new Error("Failed"))));
        UserController.getUserByName({username : "test"}).catch(error => {
        assert.strictEqual(error.message ,"Failed");
        assert.strictEqual(fake.callCount,1); 
        });
    })

    it('test get user info by id ', () => {
        const fake = sinon.replace(axios, 'get', sinon.fake.returns(global.Promise.resolve({ res: "ok", data: { name: "Hemant" } })));
        UserController.getUserById({}, 1).then(res => {
         assert.deepStrictEqual(res.name, "Hemant")
         assert.strictEqual(fake.callCount,1); 
        });
     });

     it('test get user info by id should fail', () => {
        const fake = sinon.replace(axios, 'get', sinon.fake.returns(global.Promise.reject(new Error("Failed"))));
        UserController.getUserById({}, 1).catch(error => {
        assert.strictEqual(error.message ,"Failed");
        assert.strictEqual(fake.callCount,1); 
        });
     });
    
})

describe("User profile test", () => {
    it("should call profile and get 401 status", (done) => {
        chai.request(app)
            .get('/api/users/profile')
            .end((err, res) => {
               res.should.have.status(401);
               res.body.should.be.a('object');
               done();
            });
   })

   it("should call profile and get 401 status", (done) => {
    chai.request(app)
        .get('/api/users/byId')
        .end((err, res) => {
           res.should.have.status(401);
           res.body.should.be.a('object');
           done();
        });
})
});

describe('Should check error for User api', () => {
    let token;
    beforeEach(async() => {
        const encrypted = Encryptor.encrypt(utils.credToToken({ user: TEST_USER, password: TEST_PASS }));
        token = await Tokenization.generateToken({ username: "test", token: encrypted });
    });

    it('test get user profile Should get error', (done) => {
        // setTimeout(() => done(), 1000);
        chai.request(app)
        .get('/api/users/profile')
        .set({'authorization': `Bearer ${token}`})
        .end((err, res) => {
            res.should.have.status(500);
            done();
         });
    });

    it('test get user profile Should get error', (done) => {
        setTimeout(() => done(), 1000);
        chai.request(app)
        .get('/api/users/byId')
        .set({'authorization': `Bearer ${token}`})
        .end((err, res) => {
            res.should.have.status(400);
            done();
         });
    });

})