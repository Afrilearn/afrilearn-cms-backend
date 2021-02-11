import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import '../db';
import mongoose from 'mongoose';
import app from '../index';
import Response from '../utils/response.utils';
import CmsUser from '../db/models/cmsUsers.model';

chai.use(chaiHttp);
chai.should();

const { expect } = chai;
const signinUrl = '/api/v1/auth/signin';

const testUserDetails = {
  _id: new mongoose.mongo.ObjectId(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john_doe@email.com',
  password: bcrypt.hashSync('blessing', 10),
};

describe(`POST ${signinUrl}`, () => {
  before((done) => {
    CmsUser.deleteMany({ email: testUserDetails.email }, (err) => {
      if (!err) {
        done();
      }
    });
    const user = new CmsUser(testUserDetails);
    user.save();
  });
  after((done) => {
    CmsUser.deleteMany({ email: testUserDetails.email }, (err) => {
      if (!err) {
        done();
      }
    });
  });
  describe('SUCCESS', () => {
    it('should sign in a user successfully', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({
          email: testUserDetails.email,
          password: 'blessing',
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.user).to.not.have.key('password');
      expect(res.body.data).to.have.keys('token', 'user');
      expect(res.body.data.token).to.be.a('string');
      expect(res.body.data.user.fullName).to.equal(testUserDetails.fullName);
      expect(res.body.data.user.email).to.equal(testUserDetails.email);
    });
  });

  describe('FAKE INTERNAL SERVER ERROR', () => {
    let stub;
    before(() => {
      stub = sinon.stub(Response, 'Success').throws(new Error('error'));
    });
    after(() => {
      stub.restore();
    });
    it('returns status of 500', (done) => {
      chai
        .request(app)
        .post(signinUrl)
        .send({ email: testUserDetails.email, password: 'blessing' })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property('error')
            .to.equals('Error Logging in User');
          done();
        });
    });
  });

  describe('FAILURE', () => {
    it('should fail to sign in user with incorrect email', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: 'another@example.com', password: testUserDetails.password });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });
  });

  describe('FAILURE', () => {
    it('should fail to sign in user with incorrect password', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: testUserDetails.email, password: 'incorrectpwd' });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });
  });
  it('should fail to sign in user with no email field in request', async () => {
    const res = await chai.request(app)
      .post(signinUrl)
      .send({ password: testUserDetails.password });

    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.contain('Invalid Request');
    expect(res.body).to.have.property('error');
    expect(res.body).to.have.property('errors');
    expect(res.body).to.be.an('object');
    expect(res.body.errors).to.be.an.instanceOf(Array);
    expect(res.body.errors).to.include.members(['Email is required']);
  });

  it('should fail to sign in user with empty email string', async () => {
    const res = await chai.request(app)
      .post(signinUrl)
      .send({ email: '', password: testUserDetails.password });

    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.contain('Invalid Request');
    expect(res.body).to.have.property('error');
    expect(res.body).to.have.property('errors');
    expect(res.body).to.be.an('object');
    expect(res.body.errors).to.be.an.instanceOf(Array);
    expect(res.body.errors).not.to.include.members(['Email is required']);
    expect(res.body.errors).to.include.members(['Email cannot be empty']);
  });

  it('should fail to sign in user with non-string email', async () => {
    const res = await chai.request(app)
      .post(signinUrl)
      .send({ email: 10, password: testUserDetails.password });

    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.contain('Invalid Request');
    expect(res.body).to.have.property('error');
    expect(res.body).to.have.property('errors');
    expect(res.body).to.be.an('object');
    expect(res.body.errors).to.be.an.instanceOf(Array);
    expect(res.body.errors).not.to.include.members(['Email is required']);
    expect(res.body.errors).to.include.members(['Email should be a valid email address']);
  });

  it('should fail to sign in user with invalid email format', async () => {
    const res = await chai.request(app)
      .post(signinUrl)
      .send({ email: 'user@example', password: testUserDetails.password });

    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.contain('Invalid Request');
    expect(res.body).to.have.property('error');
    expect(res.body).to.have.property('errors');
    expect(res.body).to.be.an('object');
    expect(res.body.errors).to.be.an.instanceOf(Array);
    expect(res.body.errors).not.to.include.members(['Email is required']);
    expect(res.body.errors).to.include.members(['Email should be a valid email address']);
  });

  it('should fail to sign in user with incorrect password', async () => {
    const res = await chai.request(app)
      .post(signinUrl)
      .send({ email: testUserDetails.email, password: 'incorrectpwd' });

    expect(res.status).to.equal(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.equal('error');
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.be.an('object');
    expect(res.body.error).to.have.property('message');
    expect(res.body.error.message).to.equal('Incorrect email or password');
  });

  it('should fail to sign in user with no password field supplied', async () => {
    const res = await chai.request(app)
      .post(signinUrl)
      .send({ email: testUserDetails.email });

    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.contain('Invalid Request');
    expect(res.body).to.have.property('error');
    expect(res.body).to.have.property('errors');
    expect(res.body).to.be.an('object');
    expect(res.body.errors).to.be.an.instanceOf(Array);
    expect(res.body.errors).to.include.members(['Password is required']);
  });

  it('should fail to sign in user with empty password string', async () => {
    const res = await chai.request(app)
      .post(signinUrl)
      .send({ email: testUserDetails.email, password: '' });

    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.contain('Invalid Request');
    expect(res.body).to.have.property('error');
    expect(res.body).to.have.property('errors');
    expect(res.body).to.be.an('object');
    expect(res.body.errors).to.be.an.instanceOf(Array);
    expect(res.body.errors).not.to.include.members(['Password is required']);
    expect(res.body.errors).to.include.members(['Password cannot be empty']);
  });

  it('should fail to sign in user with non-string password', async () => {
    const res = await chai.request(app)
      .post(signinUrl)
      .send({ email: testUserDetails.email, password: 10 });

    expect(res.status).to.equal(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.equal('error');
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.be.an('object');
    expect(res.body.error).to.have.property('message');
    expect(res.body.error.message).to.equal('Incorrect email or password');
  });
});
