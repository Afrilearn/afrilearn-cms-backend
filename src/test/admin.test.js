import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import EnrolledCourses from '../db/models/enrolledCourses.model';

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

const invalidToken = 'invalid.jwt.token';
const staffToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209ab2792e63fc841de3c',
  'Staff User',
);
const moderatorToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209c32792e63fc841de3d',
  'Moderator User',
);
const adminToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209d72792e63fc841de3e',
  'Administrator User',
);

const baseUrl = '/api/v1/admin/';

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
