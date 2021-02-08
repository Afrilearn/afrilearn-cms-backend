import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Users from '../db/models/cmsUsers.model';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';
import Helper from "../utils/helpers.utils";

import app from '../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: '12345678',
  role: mongoose.Types.ObjectId(),
};
const userUpdate = {
  firstName: 'Janet',
  lastName: 'Dame',
  email: 'janetdame@example.com',
  role: mongoose.Types.ObjectId(),
};
const invalidToken = 'invalid.jwt.token';
const staffToken = userUtils.generateToken(Helper.createMongooseId, "1", "Staff User");
const moderatorToken = userUtils.generateToken(Helper.createMongooseId, "2", "Moderator User");
const adminToken = userUtils.generateToken(Helper.createMongooseId, "3", "Administrator User");

const baseUrl = '/api/v1/users';

describe('USERS', () => {
  describe(`/PATCH ${baseUrl}/:userId`, () => {
    let userId;
    beforeEach(async () => {
      await Users.deleteMany();
      const createdUser = await Users.create(user);
      userId = createdUser._id;
    });
    afterEach((done) => {
      Users.deleteMany((err) => {
        if (!err) done();
      });
    });
    describe('SUCCESS', () => {
      beforeEach(async () => {
        await Users.deleteMany();
        const createdUser = await Users.create(user);
        userId = createdUser._id;
      });
      afterEach((done) => {
        Users.deleteMany((err) => {
          if (!err) done();
        });
      });

      it('should edit user if request is valid and user is admin', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', adminToken)
          .send(userUpdate)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('Success');
            res.body.data.should.have.property('user');
            res.body.data.user.should.have
              .property('firstName')
              .to.equals(userUpdate.firstName);
            res.body.data.user.should.have
              .property('lastName')
              .to.equals(userUpdate.lastName);
            res.body.data.user.should.have
              .property('email')
              .to.equals(userUpdate.email);
            res.body.data.user.should.have.property('role');
            res.body.data.user.role.should.not.equals(user.role.toHexString());
            done();
          });
      });
    });

    describe('INVALID REQUEST PARAM', () => {
      it('should return Invalid Request error if userId param is not a valid mongoose id', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/invalidmongooseid`)
          .set('token', adminToken)
          .send(userUpdate)
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
              .to.include('Invalid mongoose ID');
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
      it('should return 500 status', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', adminToken)
          .send(userUpdate)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not edit user');
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .send(userUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', invalidToken)
          .send(userUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('ADMIN ACCESS', () => {
      it('should return 403 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', staffToken)
          .send(userUpdate)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('status').to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 403 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', moderatorToken)
          .send(userUpdate)
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
      let dynamicuser;
      let request;
      beforeEach(() => {
        dynamicuser = {};
        request = chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', adminToken);
      });
      it('should not edit user if first name is empty', (done) => {
        dynamicuser.firstName = '';
        request.send(dynamicuser).end((err, res) => {
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
      it('should not edit user if first name is not string', (done) => {
        dynamicuser.firstName = 2;
        request.send(dynamicuser).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('First name must be a string');
          done();
        });
      });
      it('should not edit user if last name is empty', (done) => {
        dynamicuser.lastName = '';
        request.send(dynamicuser).end((err, res) => {
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
      it('should not edit user if last name is not string', (done) => {
        dynamicuser.lastName = 2;
        request.send(dynamicuser).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Last name must be a string');
          done();
        });
      });

      it('should not edit user if role is empty', (done) => {
        dynamicuser.role = '';
        request.send(dynamicuser).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Role cannot be empty');
          done();
        });
      });
      it('should not edit user if role is not a string', (done) => {
        dynamicuser.role = 2;
        request.send(dynamicuser).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Role must be a string');
          done();
        });
      });
      it('should not edit user if role is not a valid mongoose id', (done) => {
        dynamicuser.role = 'invalidmongooseid';
        request.send(dynamicuser).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Invalid mongoose ID');
          done();
        });
      });

      it('should not edit user if email is invalid', (done) => {
        dynamicuser.email = 6;
        request.send(dynamicuser).end((err, res) => {
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

      it('should not edit user if password is provided', (done) => {
        dynamicuser.password = '';
        request.send(dynamicuser).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Cannot change password through this endpoint');
          done();
        });
      });
    });
    describe('USER EXISTENCE', () => {
      beforeEach((done) => {
        Users.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should send back 404 status with error if user does not exist', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', adminToken)
          .send(userUpdate)
          .end((err, res) => {
            res.status.should.equals(404);
            res.body.should.have.property('status').to.equals('404 Not Found');
            res.body.should.have
              .property('error')
              .to.equals('User with the given id does not exist');
            done();
          });
      });
    });
  });
  describe(`/DELETE ${baseUrl}/:userId`, () => {
    let userId;
    beforeEach(async () => {
      await Users.deleteMany();
      const createdUser = await Users.create(user);
      userId = createdUser._id;
    });
    afterEach((done) => {
      Users.deleteMany((err) => {
        if (!err) done();
      });
    });
    describe('SUCCESSFUL DELETE', () => {
      beforeEach(async () => {
        await Users.deleteMany();
        const createdUser = await Users.create(user);
        userId = createdUser._id;
      });
      afterEach((done) => {
        Users.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should delete user if data is valid and user is admin', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${userId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('Success');
            res.body.should.have.property('data');
            res.body.data.should.have
              .property('message')
              .to.equals('User deleted successfully');
            done();
          });
      });
    });

    describe('INVALID REQUEST PARAM', () => {
      it('should return Invalid Request error if userId param is not a valid mongoose id', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/invalidmongooseid`)
          .set('token', adminToken)
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
              .to.include('Invalid mongoose ID');
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
          .delete(`${baseUrl}/${userId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not delete user');
            done();
          });
      });
    });
    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${userId}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${userId}`)
          .set('token', invalidToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('ADMIN ACCESS', () => {
      it('should return 403 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${userId}`)
          .set('token', staffToken)
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
    describe('USER EXISTENCE', () => {
      beforeEach((done) => {
        Users.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should send back 404 status with error if user does not exist', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${userId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.status.should.equals(404);
            res.body.should.have.property('status').to.equals('404 Not Found');
            res.body.should.have
              .property('error')
              .to.equals('User with the given id does not exist');
            done();
          });
      });
    });
  });
});
