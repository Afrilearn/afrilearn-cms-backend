import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import CmsUser from '../db/models/cmsUsers.model';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';
import Helper from "../utils/helpers.utils";

import app from '../index';
import mongoose from 'mongoose';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: '12345678',
  role: '5fc8f4b99d1e3023e4942152',
};
const invalidToken = 'invalid.jwt.token';
const staffToken = userUtils.generateToken(Helper.createMongooseId, "1", "Staff User");
const moderatorToken = userUtils.generateToken(Helper.createMongooseId, "2", "Moderator User");
const adminToken = userUtils.generateToken(Helper.createMongooseId, "3", "Administrator User");

const baseUrl = '/api/v1/auth/signup';

describe(`/POST ${baseUrl}`, () => {
  describe('SUCCESSFUL SIGNUP', () => {
    before((done) => {
      CmsUser.deleteMany({ email: user.email }, (err) => {
        if (!err) done();
      });
    });
    after((done) => {
      CmsUser.deleteMany({ email: user.email }, (err) => {
        if (!err) done();
      });
    });
    it('should signup user if provided complete data', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', adminToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('status').to.equals('Success');
          res.body.data.should.have.property('user');
          res.body.data.user.should.have
            .property('firstName')
            .to.equals(user.firstName);
          res.body.data.user.should.have
            .property('lastName')
            .to.equals(user.lastName);
          res.body.data.user.should.have
            .property('email')
            .to.equals(user.email);
          res.body.data.user.should.have.property('role').to.equals(user.role);
          done();
        });
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
        .post(baseUrl)
        .set('token', adminToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property('error')
            .to.equals('Could not signup user');
          done();
        });
    });
  });

  describe('TOKEN VALIDATION', () => {
    it('should return 401 if no token is provided', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status').to.equals('401 Unauthorized');
          res.body.should.have
            .property('error')
            .to.equals('Not authorized to access data');
          done();
        });
    });
    it('should return 401 status with error if an invalid token is provided', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', invalidToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status').to.equals('401 Unauthorized');
          res.body.should.have
            .property('error')
            .to.equals('Not authorized to access data');
          done();
        });
    });
  });

  describe('ADMIN ACCESS', () => {
    it('should return 403 with error if user is moderator', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', moderatorToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('status').to.equals('401 Unauthorized');
          res.body.should.have
            .property('error')
            .to.equals('Not authorized to access data');
          done();
        });
    });
    it('should return 403 with error if user is staff', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', staffToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('status').to.equals('401 Unauthorized');
          res.body.should.have
            .property('error')
            .to.equals('Not authorized to access data');
          done();
        });
    });
  });

  describe('INPUT VALIDATION', () => {
    let request;

    beforeEach(() => {
      request = chai.request(app).post(baseUrl).set('token', adminToken);
    });

    it('should not signup user if first name is not provided', (done) => {
      request
        .send({
          lastName: 'Doe',
          password: '12345678',
          email: 'johndoe@example.com',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('First name is required');
          done();
        });
    });
    it('should not signup user if first name is empty', (done) => {
      request
        .send({
          firstName: '',
          lastName: 'Doe',
          password: '12345678',
          email: 'johndoe@example.com',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('First name cannot be empty');
          done();
        });
    });
    it('should not signup user if last name is not provided', (done) => {
      request
        .send({
          firstName: 'John',
          password: '12345678',
          email: 'johndoe@example.com',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Last name is required');
          done();
        });
    });
    it('should not signup user if last name is empty', (done) => {
      request
        .send({
          firstName: 'John',
          lastName: '',
          password: '12345678',
          email: 'johndoe@example.com',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Last name cannot be empty');
          done();
        });
    });
    it('should not signup user if password is not provided', (done) => {
      request
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Password is required');
          done();
        });
    });
    it('should not signup user if password is empty', (done) => {
      request
        .send({
          firstName: 'John',
          lastName: 'Doe',
          password: '',
          email: 'johndoe@example.com',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Password cannot be empty');
          done();
        });
    });
    it('should not signup user if password length is less than 8', (done) => {
      request
        .send({
          firstName: 'John',
          lastName: 'Doe',
          password: '123456',
          email: 'johndoe@example.com',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Password length must be at least 8 characters');
          done();
        });
    });
    it('should not signup user if email is not provided', (done) => {
      request
        .send({
          firstName: 'John',
          lastName: 'Doe',
          password: '12345678',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');

          res.body.should.have
            .property('errors')
            .to.include('Email is required');
          done();
        });
    });
    it('should not signup user if email is empty', (done) => {
      request
        .send({
          firstName: 'John',
          lastName: 'Doe',
          password: '12345678',
          email: '',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Email cannot be empty');
          done();
        });
    });
    it('should not signup user if email is invalid', (done) => {
      request
        .send({
          firstName: 'John',
          lastName: 'Doe',
          password: '12345678',
          email: 'johndoe@example',
          phoneNumber: '1234567890',
          role: '5fc8f4b99d1e3023e4942152',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Invalid email address');
          done();
        });
    });
  });

  describe('USER INEXISTENCE', () => {
    before(async () => {
      await CmsUser.deleteMany({ email: user.email });
      await CmsUser.create(user);
    });
    after((done) => {
      CmsUser.deleteMany({ email: user.email }, (err) => {
        if (!err) done();
      });
    });
    it('should return 409 if user with email already exists', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', adminToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have
            .property('status')
            .to.equals('409 Conflicting Request');
          res.body.should.have
            .property('error')
            .to.equals('User with the given email already exists');
          done();
        });
    });
  });
});
