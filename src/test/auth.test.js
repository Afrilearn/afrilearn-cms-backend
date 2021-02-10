import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import AuthMiddleware from '../middlewares/auth.middleware';

import app from '../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

describe('No Matching Endpoint', () => {
  describe('* Unknown ', () => {
    it('should throw 404 error when endpoint is not found', (done) => {
      chai
        .request(app)
        .post('/api/v1/AuthMiddleware/none')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

describe('/AuthMiddleware Middlewares', () => {
  // Test the middle wares for internal server errors
  it('fakes server error on verifyUserToken', (done) => {
    const req = { body: {} };
    const res = {
      status() { },
      send() { },
    };
    sinon.stub(res, 'status').returnsThis();
    AuthMiddleware.verifyUserToken(req, res);
    (res.status).should.have.callCount(1);
    done();
  });

  it('fakes server error on verifyManager', (done) => {
    const req = { body: {} };
    const res = {
      status() {},
      send() {},
    };
    sinon.stub(res, 'status').returnsThis();
    AuthMiddleware.verifyManager(req, res);
    res.status.should.have.callCount(1);
    done();
  });
});
