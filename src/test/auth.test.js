// import chai from 'chai';
// import sinon from 'sinon';
// import chaiHttp from 'chai-http';
// import Sinonchai from 'sinon-chai';
// import mongoose from 'mongoose';
// import Users from '../db/models/cmsUsers.model';
// import userUtils from '../utils/user.utils';
// import Response from '../utils/response.utils';

// import app from '../index';

// chai.should();
// chai.use(Sinonchai);
// chai.use(chaiHttp);

// const unhashedPassword = '12345678';
// let user;
// userUtils.encryptPassword(unhashedPassword).then((password) => {
//   user = {
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'johndoe@gmail.com',
//     password,
//     role: '5fc8f4b99d1e3023e4942152',
//   };
// });

// const invalidToken = 'invalid.jwt.token';
// const staffToken = userUtils.generateToken(
//   mongoose.Types.ObjectId(),
//   '602209ab2792e63fc841de3c',
//   'Staff User',
// );
// const moderatorToken = userUtils.generateToken(
//   mongoose.Types.ObjectId(),
//   '602209c32792e63fc841de3d',
//   'Moderator User',
// );
// const adminToken = userUtils.generateToken(
//   mongoose.Types.ObjectId(),
//   '602209d72792e63fc841de3e',
//   'Administrator User',
// );

// const baseUrl = '/api/v1/auth';

// describe('No Matching Endpoint', () => {
//   describe('* Unknown ', () => {
//     it('should throw 404 error when endpoint is not found', (done) => {
//       chai
//         .request(app)
//         .post('/api/v1/AuthMiddleware/none')
//         .end((err, res) => {
//           res.should.have.status(404);
//           done();
//         });
//     });
//   });
// });

// describe(`/PATCH ${baseUrl}/change_password`, () => {
//   let userId;
//   beforeEach(async () => {
//     await Users.deleteMany();
//     const createdUser = await Users.create(user);
//     userId = createdUser._id;
//   });
//   afterEach((done) => {
//     Users.deleteMany((err) => {
//       if (!err) done();
//     });
//   });
//   describe('SUCCESSFUL PASSWORD CHANGE', () => {
//     beforeEach(async () => {
//       await Users.deleteMany();
//       const createdUser = await Users.create(user);
//       userId = createdUser._id;
//     });
//     afterEach((done) => {
//       Users.deleteMany((err) => {
//         if (!err) done();
//       });
//     });
//     it('should change password if all inputs are valid', (done) => {
//       chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .set('token', adminToken)
//         .send({ userId, password: `${user.password}new` })
//         .end((err, res) => {
//           res.status.should.equals(200);
//           res.body.should.have.property('status').to.equals('success');
//           res.body.should.have.property('data');
//           res.body.data.should.have
//             .property('message')
//             .to.equals('Password changed successfully');
//           done();
//         });
//     });
//   });

//   describe('FAKE INTERNAL SERVER ERROR', () => {
//     let stub;
//     before(() => {
//       stub = sinon.stub(Response, 'Success').throws(new Error('error'));
//     });
//     after(() => {
//       stub.restore();
//     });
//     it('returns status of 500', (done) => {
//       chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .set('token', adminToken)
//         .send({ userId, password: `${user.password}new` })
//         .end((err, res) => {
//           res.should.have.status(500);
//           res.body.should.have
//             .property('error')
//             .to.equals('Error changing password');
//           done();
//         });
//     });
//   });

//   describe('TOKEN VALIDATION', () => {
//     it('should return 401 with error message if no token is provided', (done) => {
//       chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .end((err, res) => {
//           res.should.have.status(401);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('error')
//             .to.equals('Not authorized to access data');
//           done();
//         });
//     });
//     it('should return 401 with error message if an invalid token is provided', (done) => {
//       chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .set('token', invalidToken)
//         .end((err, res) => {
//           res.should.have.status(401);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('error')
//             .to.equals('Not authorized to access data');
//           done();
//         });
//     });
//   });

//   describe('ADMIN ACCESS', () => {
//     it('should return 401 with error if user is staff', (done) => {
//       chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .set('token', staffToken)
//         .end((err, res) => {
//           res.should.have.status(401);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('error')
//             .to.equals('Not authorized to access data');
//           done();
//         });
//     });
//     it('should return 401 with error if user is moderator', (done) => {
//       chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .set('token', moderatorToken)
//         .end((err, res) => {
//           res.should.have.status(401);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('error')
//             .to.equals('Not authorized to access data');
//           done();
//         });
//     });
//   });
//   describe('USER EXISTENCE', () => {
//     beforeEach((done) => {
//       Users.deleteMany((err) => {
//         if (!err) done();
//       });
//     });
//     it('should send back 404 status with error if user does not exist', (done) => {
//       chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .set('token', adminToken)
//         .send({ userId, password: user.password })
//         .end((err, res) => {
//           res.status.should.equals(404);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('error')
//             .to.equals('User with the given id does not exist');
//           done();
//         });
//     });
//   });
//   describe('INPUT VALIDATION', () => {
//     let dynamicInput, request;
//     beforeEach(() => {
//       dynamicInput = {
//         userId: mongoose.Types.ObjectId(),
//         password: `${user.password}new`,
//       };
//       request = chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .set('token', adminToken);
//     });
//     it('should not change password if new password is not provided', (done) => {
//       delete dynamicInput.password;
//       request.send(dynamicInput).end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('status').to.equals('error');
//         res.body.should.have
//           .property('errors')
//           .to.include('Password is required');
//         done();
//       });
//     });
//     it('should not change password if provided password is not a string', (done) => {
//       dynamicInput.password = 2;
//       request.send(dynamicInput).end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('status').to.equals('error');
//         res.body.should.have
//           .property('errors')
//           .to.include('Password must be a string');
//         done();
//       });
//     });
//     it('should not change password if provided password has less than 8 characters', (done) => {
//       dynamicInput.password = '1234567';
//       request.send(dynamicInput).end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('status').to.equals('error');
//         res.body.should.have
//           .property('errors')
//           .to.include('Password length must be at least 8 characters');
//         done();
//       });
//     });
//     it('should not change password if no userId is provided', (done) => {
//       delete dynamicInput.userId;
//       request.send(dynamicInput).end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('status').to.equals('error');
//         res.body.should.have
//           .property('errors')
//           .to.include('User id is required');
//         done();
//       });
//     });
//     it('should not change password if userId is not a string', (done) => {
//       dynamicInput.userId = 3;
//       request.send(dynamicInput).end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('status').to.equals('error');
//         res.body.should.have
//           .property('errors')
//           .to.include('User id must be a string');
//         done();
//       });
//     });
//     it('should not change password if userId is empty', (done) => {
//       dynamicInput.userId = '';
//       request.send(dynamicInput).end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('status').to.equals('error');
//         res.body.should.have
//           .property('errors')
//           .to.include('User id cannot be empty');
//         done();
//       });
//     });
//     it('should not change password if userId is invalid mongoose id', (done) => {
//       dynamicInput.userId = 'invalidmongooseid';
//       request.send(dynamicInput).end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('status').to.equals('error');
//         res.body.should.have
//           .property('errors')
//           .to.include('User id is not a valid mongoose ID');
//         done();
//       });
//     });
//   });
//   describe('PASSWORD INEQUALITY', () => {
//     beforeEach(async () => {
//       await Users.deleteMany();
//       const createdUser = await Users.create(user);
//       userId = createdUser._id;
//     });
//     afterEach((done) => {
//       Users.deleteMany((err) => {
//         if (!err) done();
//       });
//     });
//     it('should send feedback if new password is the same as old password', (done) => {
//       chai
//         .request(app)
//         .patch(`${baseUrl}/change_password`)
//         .set('token', adminToken)
//         .send({ userId, password: unhashedPassword })
//         .end((err, res) => {
//           res.status.should.equals(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('error')
//             .to.equals('Submitted password is the same as current password');
//           done();
//         });
//     });
//   });
// });
