import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';

import app from '../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let token;

// let's set up the data we need to pass to the login method
const userCredentials = {
  email: 'david@yahoo.com',
  password: 'garyTheSnail',
};
// now let's login the user and get a token before we run any tests
before((done) => {
  chai
    .request(app)
    .post('/login')
    .send(userCredentials)
    .end((err, res) => {
      res.should.have.status(200);
      token = res.body.token;
      done();
    });
});

describe('ADMIN Endpoint', () => {
  describe('GET/api/v1/admin/', () => {
    it('should return array of a user enrolled courses', (done) => {
      const id = '7uih98943hjjdsjhjh';
      chai
        .request(app)
        .get(`/api/v1/admin/ ${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });
});
