import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Users from '../db/models/cmsUsers.model';
import AfrilearnUsers from '../db/models/users.model';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';
import EnrolledCourses from '../db/models/enrolledCourses.model';

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

const userTwo = {
  firstName: 'Kate',
  lastName: 'Doe',
  email: 'katedoe@gmail.com',
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
            res.body.should.have.property('status').to.equals('success');
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
            res.body.data.user.should.have.property('updatedAt');
            res.body.data.user.should.have
              .property('createdAt')
              .not.to.equals(res.body.data.user.updatedAt);
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
              .to.equals('error');
            res.body.should.have
              .property('errors')
              .to.include('userId is not a valid mongoose ID');
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
              .to.equals('Error editing user');
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
              .to.equals('error');
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
              .to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('ADMIN ACCESS', () => {
      it('should return 401 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', staffToken)
          .send(userUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${userId}`)
          .set('token', moderatorToken)
          .send(userUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('error');
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
            .to.equals('error');
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
            .to.equals('error');
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
            .to.equals('error');
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
            .to.equals('error');
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
            .to.equals('error');
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
            .to.equals('error');
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
            .to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Role is not a valid mongoose ID');
          done();
        });
      });

      it('should not edit user if email is invalid', (done) => {
        dynamicuser.email = 6;
        request.send(dynamicuser).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('error');
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
            .to.equals('error');
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
            res.body.should.have.property('status').to.equals('error');
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
      const createdUser = await Users.create(userTwo);
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
            res.body.should.have.property('status').to.equals('success');
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
              .to.equals('error');
            res.body.should.have
              .property('errors')
              .to.include('userId is not a valid mongoose ID');
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
              .to.equals('Error deleting user');
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
              .to.equals('error');
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
              .to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('ADMIN ACCESS', () => {
      it('should return 401 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${userId}`)
          .set('token', staffToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });
    //
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
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('User with the given id does not exist');
            done();
          });
      });
    });
  });

  // GET CMS USERS IMPLEMENTATION

  describe(`/GET ${baseUrl}`, () => {
    describe('FETCH CMS USERS SUCCESSFULLY', () => {
      before(async () => {
        await Users.deleteMany();
        const users = [];
        for (let i = 1; i < 4; i += 1) {
          users.push(
            (async () => {
              const usr = await Users.create({
                ...user,
                firstName: user.firstName + i,
                email: user.email + i,
              });
              return usr;
            })(),
          );
        }
        await Promise.all(users);
      });
      after((done) => {
        Users.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should fetch all cms users', (done) => {
        chai
          .request(app)
          .get(baseUrl)
          .set('token', staffToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('users');
            res.body.data.users.length.should.equals(3);
            const checks = res.body.data.users.map((user) => ({
              firstName: user.firstName,
              email: user.email,
            }));
            for (let i = 1; i < 4; i += 1) {
              checks.should.deep.include({
                firstName: `${user.firstName}${i}`,
                email: `${user.email}${i}`,
              });
            }
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
          .get(baseUrl)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Error fetching cms users');
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .get(baseUrl)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .get(baseUrl)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });
  });

  describe(`/GET ${baseUrl}/afrilearn`, () => {
    describe('FETCH AFRILEARN USERS SUCCESSFULLY', () => {
      before(async () => {
        await AfrilearnUsers.deleteMany();
        const users = [];
        for (let i = 1; i < 4; i += 1) {
          users.push(
            (async () => {
              const usr = await AfrilearnUsers.create({
                fullName: user.firstName + i,
                email: user.email + i,
              });
              return usr;
            })(),
          );
        }
        await Promise.all(users);
      });
      after((done) => {
        AfrilearnUsers.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should fetch all afrilearn users', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/afrilearn`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('users');
            res.body.data.users.length.should.equals(3);
            const checks = res.body.data.users.map((user) => ({
              fullName: user.fullName,
              email: user.email,
            }));
            for (let i = 1; i < 4; i += 1) {
              checks.should.deep.include({
                fullName: `${user.firstName}${i}`,
                email: `${user.email}${i}`,
              });
            }
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
          .get(`${baseUrl}/afrilearn`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Error fetching afrilearn users');
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/afrilearn`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/afrilearn`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });
  });

  // GET USERS ENROLLED COURSES
  describe(`/GET ${baseUrl}/:userId/enrolled-courses`, () => {
    let userId;
    beforeEach(async () => {
      await AfrilearnUsers.deleteMany();
      await EnrolledCourses.deleteMany();
      const createdUser = await AfrilearnUsers.create({
        fullName: 'Test User', email: 'testuser@exmple.com',
      });
      userId = createdUser._id;
      const courses = [];
      for (let i = 1; i < 4; i += 1) {
        courses.push(
          (async () => {
            const course = await EnrolledCourses.create({
              userId,
              courseId: mongoose.Types.ObjectId(),
            });
            return course;
          })(),
        );
      }
      await Promise.all(courses);
    });
    afterEach(async () => {
      await AfrilearnUsers.deleteMany();
      await EnrolledCourses.deleteMany();
    });
    describe('Successful fetch of enrolled courses', () => {
      it('should fetch all user courses for an admin', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${userId}/enrolled-courses`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('courses');
            res.body.data.courses.length.should.equals(3);
            const courses = res.body.data.courses.map(
              (course) => course.userId,
            );
            for (let i = 1; i < 4; i += 1) {
              courses.should.include(`${userId}`);
            }
            done();
          });
      });
      it('should fetch all questions for a moderator', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${userId}/enrolled-courses`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('courses');
            res.body.data.courses.length.should.equals(3);
            const courses = res.body.data.courses.map(
              (course) => course.userId,
            );
            for (let i = 1; i < 4; i += 1) {
              courses.should.include(`${userId}`);
            }
            done();
          });
      });
      it('should fetch all questions for a staff', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${userId}/enrolled-courses`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('courses');
            res.body.data.courses.length.should.equals(3);
            const courses = res.body.data.courses.map(
              (course) => course.userId,
            );
            for (let i = 1; i < 4; i += 1) {
              courses.should.include(`${userId}`);
            }
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${userId}/enrolled-courses`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${userId}/enrolled-courses`)
          .set('token', invalidToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
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
          .get(`${baseUrl}/${userId}/enrolled-courses`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Error fetching enrolled courses');
            done();
          });
      });
    });
  });
});
