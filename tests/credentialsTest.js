const chai = require('chai');
const axios = require('axios');
const chaiHttp = require('chai-http');
const assert = chai.assert;
let app = require('../app');
const { TEST_USER, TEST_PASS } = require('../constants');
const mockData = require('../data/credentials');
const Encryptor = require('../lib/encryption');
const Tokenization = require('../lib/token-config');
const utils = require('../lib/utils');
var sinon = require("sinon");
const CredentialController = require('../controllers/credentialController');

// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Credentials API Unauthorized", () => {
    // Test to get all students record
    it("/api/credentials should get 401 unauthorized", (done) => {
        chai.request(app)
            .get('/api/credentials')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });


    // Test to get single student record
    it("/api/credentials/checkout should checkout credentials", (done) => {
        const id = 1;
        chai.request(app)
            .post(`/api/credentials/checkout`)
            .send({ id })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });

    // Test to get single student record
    it("should checkin credentials", (done) => {
        const id = 1;
        chai.request(app)
            .post(`/api/credentials/checkin`)
            .send({ id })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
});



describe('Fake backend Credenial API test', () => {
    let token2;
    afterEach(() => {
        sinon.restore();
    });
    beforeEach(async() => {
        const encrypted = Encryptor.encrypt(utils.credToToken({ user: process.env.TEST_USER, password: process.env.TEST_PASS }));
        token2 = await Tokenization.generateToken({ username: process.env.TEST_CRED_USER, token: encrypted });
    });

    it('test get all ', () => {
        const fake = sinon.replace(axios, 'get', sinon.fake.returns(global.Promise.resolve({ res: "ok", data: { credentials: mockData } })));
        CredentialController.getAllCredentials({ token: token2 }).then(res => {
            assert.deepStrictEqual(res.credentials, mockData)
            assert.strictEqual(res.credentials.length, 10);
            assert.strictEqual(fake.callCount, 1);
        });
    });

    it('get all credentials should fail', () => {
        const fake = sinon.replace(axios, 'get', sinon.fake.returns(global.Promise.reject(new Error("Failed"))));
        CredentialController.getAllCredentials({ token: token2 }).catch(error => {
            assert.strictEqual(error.message, "Failed");
            assert.strictEqual(fake.callCount, 1);
        });
    });

    it('checkout a credentials ', () => {
        const fake = sinon.replace(axios, 'post', sinon.fake.returns(global.Promise.resolve({ res: "ok", data: { success: true } })));
        CredentialController.checkOutCredential({ id: 1, comment: "" }, { token: token2 }).then(res => {
            assert.strictEqual(res.success.length, true);
            assert.strictEqual(fake.callCount, 1);
        });
    });

    it('checkout a credentials should fail', () => {
        const fake = sinon.replace(axios, 'post', sinon.fake.returns(global.Promise.reject(new Error("Failed"))));
        CredentialController.checkOutCredential({ id: 1, comment: "" }, { token: token2 }).catch(error => {
            assert.strictEqual(error.message, "Failed");
            assert.strictEqual(fake.callCount, 1);
        });
    });

    it('test checkin a credentials ', () => {
        const fake = sinon.replace(axios, 'post', sinon.fake.returns(global.Promise.resolve({ res: "ok", data: { success: true } })));
        CredentialController.checkInCredential({ id: 1, comment: "" }, { token: token2 }).then(res => {
            assert.strictEqual(res.success.length, true);
            assert.strictEqual(fake.callCount, 1);
        });
    });

    it('checkin a credentials should fail', () => {
        const fake = sinon.replace(axios, 'post', sinon.fake.returns(global.Promise.reject(new Error("Failed"))));
        CredentialController.checkInCredential({ id: 1, comment: "" }, { token: token2 }).catch(error => {
            assert.strictEqual(error.message, "Failed");
            assert.strictEqual(fake.callCount, 1);
        });
    });

    it('search a credentials should fail', () => {
        const fake = sinon.replace(axios, 'get', sinon.fake.returns(global.Promise.reject(new Error("Failed"))));
        CredentialController.queryCredentials("test" , { token: token2 }).catch(error => {
            assert.strictEqual(error.message, "Failed");
            assert.strictEqual(fake.callCount, 1);
        });
    });

})


describe('Should check error for credentials api', () => {
    let token;
    beforeEach(async() => {
        const encrypted = Encryptor.encrypt(utils.credToToken({ user: TEST_USER, password: TEST_PASS }));
        token = await Tokenization.generateToken({ username: process.env.TEST_USER, token: encrypted });
    });

    it('test search Credentials Should get error', (done) => {
        // setTimeout(() => done(), 1000);
        chai.request(app)
        .get('/api/credentials/search?searchText=test')
        .set({'authorization': `Bearer ${token}`})
        .end((err, res) => {
            res.should.have.status(400);
            done();
         });
    });

    it('test get all Should get error', (done) => {
        // setTimeout(() => done(), 1000);
        chai.request(app)
        .get('/api/credentials')
        .set({'authorization': `Bearer ${token}`})
        .end((err, res) => {
            res.should.have.status(400);
            done();
         });
    });

    it('test checkout Should get error', (done) => {
        // setTimeout(() => done(), 1000);
        chai.request(app)
        .post('/api/credentials/checkout')
        .set({'authorization': `Bearer ${token}`})
        .end((err, res) => {
            res.should.have.status(400);
            done();
         });
    });
    

    it('test checkin Should get error', (done) => {
        // setTimeout(() => done(), 1000);
        chai.request(app)
        .post('/api/credentials/checkin')
        .set({'authorization': `Bearer ${token}`})
        .end((err, res) => {
            res.should.have.status(400);
            done();
         });
    })
})
