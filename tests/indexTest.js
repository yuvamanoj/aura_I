// Import the dependencies for testing
const axios = require('axios');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
let app  = require('../app');
const sinon = require('sinon');
const Auth = require('../controllers/authenticate');
const { TEST_USER, TEST_PASS } = require('../constants');
const Encryptor = require('../lib/encryption');
const Tokenization = require('../lib/token-config');
const utils = require('../lib/utils');

// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Index", () => {
    describe("credential manager UI", () => {
        // Test to get all students record
        it("should serve login page", (done) => {
             chai.request(app)
                 .get('/')
                 .end((err, res) => {
                        res.should.have.status(200);
                     done();
                  });
         });

         it("should test auth route", (done) => {
            chai.request(app)
                .get('/auth')
                .end((err, res) => {
                       res.should.have.status(401);
                    done();
                 });
        });

        it("should test login route", (done) => {
         chai.request(app)
             .post('/login')
             .end((err, res) => {
                    res.should.have.status(401);
                 done();
              });
     });

         it("should return 404", (done) => {
            chai.request(app)
                .get('/me')
                .end((err, res) => {
                       res.should.have.status(404);
                    done();
                 });
        });
        });

  
});

describe('Fake backend test', () => {
   afterEach(() => {
      sinon.restore();
   });
   it('test login', async () => {
      var fake = sinon.replace(axios, 'post', sinon.fake.returns(global.Promise.resolve({res: "ok", token: "xyz"})));
      Auth.authenticate({user: "invalid", password: "invalid"}).then(res => {
         assert.strictEqual(res.res,"ok");
         assert.strictEqual(fake.callCount,1);
      })
   });
})


describe("login to credential manager UI", () => {
    it("should test authenticate controller authorize function", () => {
      var res = {
         send: (ob) => {
           return ob;
         },
       };
         let data = Auth.authorize({ user: { name: "test"}},res);
         assert.strictEqual(data,res.send());
     });
});


describe('Should check token on Auth route', () => {
   let token;
   beforeEach(async() => {
       const encrypted = Encryptor.encrypt(utils.credToToken({ user: TEST_USER, password: TEST_PASS }));
       token = await Tokenization.generateToken({ username: "test", token: encrypted });
   });
   it('should check /auth route', (done) => {
         chai.request(app)
         .get('/auth')
         .set({'authorization': `Bearer ${token}`})
         .end((err, res) => {
             res.should.have.status(200);
             done();
          });
     });

     it('should check /auth route to invalid', (done) => {
      chai.request(app)
      .get('/auth')
      .set({'authorization': `Bearer ${"token"}`})
      .end((err, res) => {
          res.should.have.status(401);
          done();
       });
  });
   })
