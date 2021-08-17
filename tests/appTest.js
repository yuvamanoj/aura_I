// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
let app = require('../app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("test liveness and readiness", () => {
    // Test to get all students record
    it("should get 200 for liveness", (done) => {
        chai.request(app)
            .get('/liveness')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it("should get 200 for readiness", (done) => {
        chai.request(app)
            .get('/readiness')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it("should get 200 for health", (done) => {
        chai.request(app)
            .get('/health')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it("should get 200 for health", (done) => {
        chai.request(app)
            .get('/info')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
})