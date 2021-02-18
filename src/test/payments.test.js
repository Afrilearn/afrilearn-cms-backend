// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import Sinonchai from 'sinon-chai';
// import sinon from 'sinon';
// import mongoose from 'mongoose';
// import userUtils from '../utils/user.utils';
// import Response from '../utils/response.utils';
// import PaymentController from '../controllers/payment.controller';
// import PaymentTransactions from '../db/models/payments.model';

// import app from '../index';
// import PaymentPlans from '../db/models/paymentPlans.model';

// chai.should();
// chai.use(Sinonchai);
// chai.use(chaiHttp);

// const validCategory = mongoose.Types.ObjectId();
// const paymentPlan = {
//   name: 'Gold',
//   duration: 2,
//   amount: 25000,
//   category: validCategory,
// };

// const paymentPlanUpdate = {
//   name: 'Gold',
//   duration: 2,
//   amount: 25000,
//   category: validCategory,
// };
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

// const baseUrl = '/api/v1/payments/plans';
// describe('PAYMENT PLANS', () => {
//   describe(`/POST ${baseUrl}`, () => {
//     describe('SUCCESSFUL PAYMENT PLAN CREATION', () => {
//       beforeEach((done) => {
//         PaymentPlans.deleteMany((err) => {
//           if (!err) done();
//         });
//       });
//       afterEach((done) => {
//         PaymentPlans.deleteMany((err) => {
//           if (!err) done();
//         });
//       });
//       it('should create payment plan if request is valid and user is admin', (done) => {
//         chai
//           .request(app)
//           .post(baseUrl)
//           .set('token', adminToken)
//           .send(paymentPlan)
//           .end((err, res) => {
//             res.should.have.status(201);
//             res.body.should.have.property('status').to.equals('success');
//             res.body.data.should.have.property('paymentPlan');
//             res.body.data.paymentPlan.should.have
//               .property('name')
//               .to.equals(paymentPlan.name);
//             res.body.data.paymentPlan.should.have
//               .property('duration')
//               .to.equals(paymentPlan.duration);
//             res.body.data.paymentPlan.should.have
//               .property('amount')
//               .to.equals(paymentPlan.amount);
//             res.body.data.paymentPlan.should.have
//               .property('category')
//               .to.equals(paymentPlan.category.toHexString());
//             done();
//           });
//       });
//     });
//     describe('FAKE INTERNAL SERVER ERROR', () => {
//       let stub;
//       before(() => {
//         stub = sinon.stub(Response, 'InternalServerError').returnsThis();
//       });
//       after(() => {
//         stub.restore();
//       });
//       it('returns status of 500', async () => {
//         const req = undefined;
//         await PaymentController.addPaymentPlan(req);
//         stub.should.have.callCount(1);
//       });
//     });
//     describe('TOKEN VALIDATION', () => {
//       it('should return 401 with error message if no token is provided', (done) => {
//         chai
//           .request(app)
//           .post(baseUrl)
//           .send(paymentPlan)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//       it('should return 401 status with error message if an invalid token is provided', (done) => {
//         chai
//           .request(app)
//           .post(baseUrl)
//           .set('token', invalidToken)
//           .send(paymentPlan)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//     });

//     describe('ADMIN ACCESS', () => {
//       it('should return 401 with error if user is moderator', (done) => {
//         chai
//           .request(app)
//           .post(baseUrl)
//           .set('token', staffToken)
//           .send(paymentPlan)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//       it('should return 401 with error if user is admin', (done) => {
//         chai
//           .request(app)
//           .post(baseUrl)
//           .set('token', staffToken)
//           .send(paymentPlan)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//     });

//     describe('INPUT VALIDATION', () => {
//       let request;
//       let dynamicPaymentPlan;
//       beforeEach(() => {
//         request = chai.request(app).post(baseUrl).set('token', adminToken);
//         dynamicPaymentPlan = {
//           name: 'Gold',
//           duration: 2,
//           amount: 25000,
//           category: validCategory,
//         };
//       });

//       it('should not create payment plan if payment plan name is not provided', (done) => {
//         delete dynamicPaymentPlan.name;
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan name is required');
//           done();
//         });
//       });
//       it('should not create payment plan if payment plan name is empty', (done) => {
//         dynamicPaymentPlan.name = '';
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan name cannot be empty');
//           done();
//         });
//       });
//       it('should not create payment plan if payment plan name is not string', (done) => {
//         dynamicPaymentPlan.name = 2;
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan name must be a string');
//           done();
//         });
//       });

//       it('should not create payment plan if payment plan duration is not provided', (done) => {
//         delete dynamicPaymentPlan.duration;
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan duration is required');
//           done();
//         });
//       });
//       it('should not create payment plan if payment plan duration is not a number', (done) => {
//         dynamicPaymentPlan.duration = 'invalid duration';
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan duration must be a number');
//           done();
//         });
//       });

//       it('should not create payment plan if category is not provided', (done) => {
//         delete dynamicPaymentPlan.category;
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan category is required');
//           done();
//         });
//       });
//       it('should not create payment plan if category is not a valid mongoose id', (done) => {
//         dynamicPaymentPlan.category = 'invalidmongooseid';
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan category is not a valid mongoose ID');
//           done();
//         });
//       });

//       it('should not create payment plan if amount is not provided', (done) => {
//         delete dynamicPaymentPlan.amount;
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan amount is required');
//           done();
//         });
//       });
//       it('should not create payment plan if amount is not a number', (done) => {
//         dynamicPaymentPlan.amount = 'invalid amount';
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan amount must be a number');
//           done();
//         });
//       });
//     });
//     describe('PAYMENT PLAN INEXISTENCE', () => {
//       beforeEach((done) => {
//         PaymentPlans.create(paymentPlan, (err) => {
//           if (!err) done();
//         });
//       });
//       it('should send back 409 status with error if payment plan exists', (done) => {
//         chai
//           .request(app)
//           .post(baseUrl)
//           .set('token', adminToken)
//           .send(paymentPlan)
//           .end((err, res) => {
//             res.status.should.equals(409);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('This payment plan already exists');
//             done();
//           });
//       });
//     });
//   });

//   describe(`/PATCH ${baseUrl}/:paymentPlanId`, () => {
//     let paymentPlanId;
//     describe('SUCCESS', () => {
//       beforeEach(async () => {
//         await PaymentPlans.deleteMany();
//         const createdPaymentPlan = await PaymentPlans.create(paymentPlan);
//         paymentPlanId = createdPaymentPlan._id;
//       });
//       afterEach((done) => {
//         PaymentPlans.deleteMany((err) => {
//           if (!err) done();
//         });
//       });

//       it('should edit payment plan if request is valid and user is admin', (done) => {
//         chai
//           .request(app)
//           .patch(`${baseUrl}/${paymentPlanId}`)
//           .set('token', adminToken)
//           .send(paymentPlanUpdate)
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.have.property('status').to.equals('success');
//             res.body.data.should.have.property('paymentPlan');
//             res.body.data.paymentPlan.should.have
//               .property('name')
//               .to.equals(paymentPlanUpdate.name);
//             res.body.data.paymentPlan.should.have
//               .property('duration')
//               .to.equals(paymentPlanUpdate.duration);
//             res.body.data.paymentPlan.should.have
//               .property('amount')
//               .to.equals(paymentPlanUpdate.amount);
//             res.body.data.paymentPlan.should.have
//               .property('category')
//               .to.equals(paymentPlanUpdate.category.toHexString());
//             done();
//           });
//       });
//     });

//     describe('FAKE INTERNAL SERVER ERROR', () => {
//       let stub;
//       before(() => {
//         stub = sinon.stub(Response, 'InternalServerError').returnsThis();
//       });
//       after(() => {
//         stub.restore();
//       });
//       it('returns status of 500', async () => {
//         const req = undefined;
//         await PaymentController.editPaymentPlan(req);
//         stub.should.have.callCount(1);
//       });
//     });

//     describe('TOKEN VALIDATION', () => {
//       it('should return 401 with error message if no token is provided', (done) => {
//         chai
//           .request(app)
//           .patch(`${baseUrl}/${paymentPlanId}`)
//           .send(paymentPlanUpdate)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//       it('should return 401 status with error message if an invalid token is provided', (done) => {
//         chai
//           .request(app)
//           .patch(`${baseUrl}/${paymentPlanId}`)
//           .set('token', invalidToken)
//           .send(paymentPlanUpdate)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//     });

//     describe('ADMIN ACCESS', () => {
//       it('should return 401 with error if user is moderator', (done) => {
//         chai
//           .request(app)
//           .patch(`${baseUrl}/${paymentPlanId}`)
//           .set('token', moderatorToken)
//           .send(paymentPlanUpdate)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//       it('should return 401 with error if user is staff', (done) => {
//         chai
//           .request(app)
//           .patch(`${baseUrl}/${paymentPlanId}`)
//           .set('token', staffToken)
//           .send(paymentPlanUpdate)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//     });

//     describe('INPUT VALIDATION', () => {
//       let dynamicPaymentPlan;
//       let request;
//       beforeEach(() => {
//         dynamicPaymentPlan = {};
//         request = chai
//           .request(app)
//           .patch(`${baseUrl}/${paymentPlanId}`)
//           .set('token', adminToken);
//       });
//       it('should not edit payment plan if payment plan name is empty', (done) => {
//         dynamicPaymentPlan.name = '';
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan name cannot be empty');
//           done();
//         });
//       });
//       it('should not edit payment plan if payment plan name is not a string', (done) => {
//         dynamicPaymentPlan.name = 3;
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan name must be a string');
//           done();
//         });
//       });
//       it('should not edit payment plan if payment plan duration is not a number', (done) => {
//         dynamicPaymentPlan.duration = 'invalid duration';
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan duration must be a number');
//           done();
//         });
//       });
//       it('should not edit payment plan if category is not a valid mongoose id', (done) => {
//         dynamicPaymentPlan.category = 'invalidmongooseid';
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan category is not a valid mongoose ID');
//           done();
//         });
//       });

//       it('should not edit payment plan if amount is not a number', (done) => {
//         dynamicPaymentPlan.amount = 'invalid amount';
//         request.send(dynamicPaymentPlan).end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('errors')
//             .to.include('Plan amount must be a number');
//           done();
//         });
//       });

//       it('should not edit payment plan if paymentPlanId is not a valid mongoose id', (done) => {
//         chai
//           .request(app)
//           .patch(`${baseUrl}/invalidid`)
//           .set('token', adminToken)
//           .send(dynamicPaymentPlan)
//           .end((err, res) => {
//             res.should.have.status(400);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('errors')
//               .to.include('paymentPlanId is not a valid mongoose ID');
//             done();
//           });
//       });
//     });
//     describe('PAYMENT PLAN EXISTENCE', () => {
//       beforeEach((done) => {
//         PaymentPlans.deleteMany((err) => {
//           if (!err) done();
//         });
//       });
//       it('should send back 404 status with error if payment plan does not exist', (done) => {
//         chai
//           .request(app)
//           .patch(`${baseUrl}/${paymentPlanId}`)
//           .set('token', adminToken)
//           .send(paymentPlanUpdate)
//           .end((err, res) => {
//             res.status.should.equals(404);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('This payment plan does not exist');
//             done();
//           });
//       });
//     });
//   });

//   describe(`/GET ${baseUrl}`, () => {
//     describe('FETCH PAYMENT PLANS SUCCESSFULLY', () => {
//       beforeEach(async () => {
//         await PaymentPlans.deleteMany();
//         const dbPaymentPlans = [];
//         for (let i = 1; i < 4; i += 1) {
//           dbPaymentPlans.push(
//             (async () => {
//               await PaymentPlans.create({
//                 ...paymentPlan,
//                 name: `payment plan${i}`,
//               });
//             })(),
//           );
//         }

//         await Promise.all(dbPaymentPlans);
//       });
//       afterEach((done) => {
//         PaymentPlans.deleteMany((err) => {
//           if (!err) done();
//         });
//       });

//       it('should fetch payment plans for admins', (done) => {
//         chai
//           .request(app)
//           .get(baseUrl)
//           .set('token', adminToken)
//           .end((err, res) => {
//             res.status.should.equals(200);
//             res.body.should.have.property('status').to.equals('success');
//             res.body.data.should.have
//               .property('paymentPlans')
//               .to.have.length(3);
//             const checks = res.body.data.paymentPlans.map(
//               (paymentPlan) => paymentPlan.name,
//             );

//             for (let i = 1; i < 4; i += 1) {
//               checks.should.include(`payment plan${i}`);
//             }
//             done();
//           });
//       });
//     });

//     describe('FAKE INTERNAL SERVER ERROR', () => {
//       let stub;
//       before(() => {
//         stub = sinon.stub(PaymentPlans, 'find').throws(new Error('error'));
//       });
//       after(() => {
//         stub.restore();
//       });
//       it('returns status of 500', (done) => {
//         chai
//           .request(app)
//           .get(baseUrl)
//           .set('token', adminToken)
//           .end((err, res) => {
//             res.should.have.status(500);
//             res.body.should.have
//               .property('error')
//               .to.equals('Error fetching payment plans');
//             done();
//           });
//       });
//     });

//     describe('TOKEN VALIDATION', () => {
//       it('should return 401 with error message if no token is provided', (done) => {
//         chai
//           .request(app)
//           .get(baseUrl)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//       it('should return 401 status with error message if an invalid token is provided', (done) => {
//         chai
//           .request(app)
//           .get(baseUrl)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//     });

//     describe('ADMIN ACCESS', () => {
//       it('should not fetch payment plans if user is moderator', (done) => {
//         chai
//           .request(app)
//           .get(baseUrl)
//           .set('token', moderatorToken)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//       it('should not fetch payment plans if user is staff', (done) => {
//         chai
//           .request(app)
//           .get(baseUrl)
//           .set('token', staffToken)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//     });
//   });

//   describe(`/DELETE ${baseUrl}/:paymentPlanId`, () => {
//     let paymentPlanId;
//     describe('SUCCESSFUL DELETE', () => {
//       beforeEach(async () => {
//         await PaymentPlans.deleteMany();
//         const createdPaymentPlan = await PaymentPlans.create(paymentPlan);
//         paymentPlanId = createdPaymentPlan._id;
//       });
//       afterEach((done) => {
//         PaymentPlans.deleteMany((err) => {
//           if (!err) done();
//         });
//       });
//       it('should delete course if data is valid and user is admin', (done) => {
//         chai
//           .request(app)
//           .delete(`${baseUrl}/${paymentPlanId}`)
//           .set('token', adminToken)
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.have.property('status').to.equals('success');
//             res.body.should.have.property('data');
//             res.body.data.should.have
//               .property('message')
//               .to.equals('Payment plan deleted successfully');
//             done();
//           });
//       });
//     });
//     describe('FAKE INTERNAL SERVER ERROR', () => {
//       let stub;
//       before(() => {
//         stub = sinon.stub(Response, 'InternalServerError').returnsThis();
//       });
//       after(() => {
//         stub.restore();
//       });
//       it('returns status of 500', async () => {
//         const req = { params: undefined };
//         await PaymentController.deletePaymentPlan(req);
//         stub.should.have.callCount(1);
//       });
//     });
//     describe('TOKEN VALIDATION', () => {
//       it('should return 401 with error message if no token is provided', (done) => {
//         chai
//           .request(app)
//           .delete(`${baseUrl}/${paymentPlanId}`)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//       it('should return 401 status with error message if an invalid token is provided', (done) => {
//         chai
//           .request(app)
//           .delete(`${baseUrl}/${paymentPlanId}`)
//           .set('token', invalidToken)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//     });

//     describe('ADMIN ACCESS', () => {
//       it('should return 401 with error if user is moderator', (done) => {
//         chai
//           .request(app)
//           .delete(`${baseUrl}/${paymentPlanId}`)
//           .set('token', moderatorToken)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//       it('should return 401 with error if user is staff', (done) => {
//         chai
//           .request(app)
//           .delete(`${baseUrl}/${paymentPlanId}`)
//           .set('token', staffToken)
//           .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('Not authorized to access data');
//             done();
//           });
//       });
//     });

//     describe('PARAMS VALIDATION', () => {
//       it('should not delete payment plan if paymentPlanId is not a valid mongoose id', (done) => {
//         chai
//           .request(app)
//           .delete(`${baseUrl}/invalidid`)
//           .set('token', adminToken)
//           .end((err, res) => {
//             res.should.have.status(400);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('errors')
//               .to.include('paymentPlanId is not a valid mongoose ID');
//             done();
//           });
//       });
//     });
//     describe('PAYMENT PLAN EXISTENCE', () => {
//       beforeEach((done) => {
//         PaymentPlans.deleteMany((err) => {
//           if (!err) done();
//         });
//       });
//       it('should send back 404 status with error if payment plan does not exist', (done) => {
//         chai
//           .request(app)
//           .delete(`${baseUrl}/${paymentPlanId}`)
//           .set('token', adminToken)
//           .end((err, res) => {
//             res.status.should.equals(404);
//             res.body.should.have.property('status').to.equals('error');
//             res.body.should.have
//               .property('error')
//               .to.equals('This payment plan does not exist');
//             done();
//           });
//       });
//     });
//   });
// });

// const transactionUrl = '/api/v1/payments/transactions';
// describe(`/GET ${transactionUrl}/transactions`, () => {
//   describe('FETCH PAYMENT TRANSACTIONS SUCCESSFULLY', () => {
//     beforeEach(async () => {
//       await PaymentTransactions.deleteMany();
//       const dbPaymentTransactions = [];
//       for (let i = 1; i < 4; i += 1) {
//         dbPaymentTransactions.push(
//           (async () => {
//             await PaymentTransactions.create({
//               amount: i,
//             });
//           })(),
//         );
//       }

//       await Promise.all(dbPaymentTransactions);
//     });
//     afterEach((done) => {
//       PaymentTransactions.deleteMany((err) => {
//         if (!err) done();
//       });
//     });

//     it('should fetch payment transactions for admins', (done) => {
//       chai
//         .request(app)
//         .get(transactionUrl)
//         .set('token', adminToken)
//         .end((err, res) => {
//           res.status.should.equals(200);
//           res.body.should.have.property('status').to.equals('success');
//           res.body.data.should.have
//             .property('paymentTransactions')
//             .to.have.length(3);
//           const checks = res.body.data.paymentTransactions.map(
//             (paymentTransaction) => `${paymentTransaction.amount}`,
//           );

//           for (let i = 1; i < 4; i += 1) {
//             checks.should.include(`${i}`);
//           }
//           done();
//         });
//     });
//   });

//   describe('FAKE INTERNAL SERVER ERROR', () => {
//     let stub;
//     before(() => {
//       stub = sinon.stub(PaymentTransactions, 'find').throws(new Error('error'));
//     });
//     after(() => {
//       stub.restore();
//     });
//     it('returns status of 500', (done) => {
//       chai
//         .request(app)
//         .get(transactionUrl)
//         .set('token', adminToken)
//         .end((err, res) => {
//           res.should.have.status(500);
//           res.body.should.have
//             .property('error')
//             .to.equals('Error fetching payment transactions');
//           done();
//         });
//     });
//   });

//   describe('TOKEN VALIDATION', () => {
//     it('should return 401 with error message if no token is provided', (done) => {
//       chai
//         .request(app)
//         .get(transactionUrl)
//         .end((err, res) => {
//           res.should.have.status(401);
//           res.body.should.have.property('status').to.equals('error');
//           res.body.should.have
//             .property('error')
//             .to.equals('Not authorized to access data');
//           done();
//         });
//     });
//     it('should return 401 status with error message if an invalid token is provided', (done) => {
//       chai
//         .request(app)
//         .get(transactionUrl)
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
//     it('should not fetch payment plans if user is moderator', (done) => {
//       chai
//         .request(app)
//         .get(transactionUrl)
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
//     it('should not fetch payment plans if user is staff', (done) => {
//       chai
//         .request(app)
//         .get(transactionUrl)
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
//   });
// });
