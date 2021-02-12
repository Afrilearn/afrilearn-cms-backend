// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import sinon from 'sinon';
// import Sinonchai from 'sinon-chai';
// import mongoose from 'mongoose';
// import app from '../../index';
// import userUtils from '../../utils/user.utils';
// import PQCategory from '../../db/models/pastQuestionTypes.model';
// import Response from '../../utils/response.utils';

// chai.use(chaiHttp);
// chai.should();
// chai.use(Sinonchai);

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

// const testPQCategory1 = {
//   name: 'TestPQ5',
//   categoryId: 5,
// };

// const testPQCategory2 = {
//   name: 'TestPQ6',
//   categoryId: 6,
// };

// const route = '/api/v1/pqcategory';

// describe('GET ALL PAST QUESTION CATEGORIES', () => {
//   before(async () => {
//     await PQCategory.deleteMany();
//     await PQCategory.create(testPQCategory1);
//     await PQCategory.create(testPQCategory2);
//   });
//   after(async () => {
//     await PQCategory.deleteMany({ name: testPQCategory1.name });
//     await PQCategory.deleteMany({ name: testPQCategory2.name });
//   });
//   describe(`/GET ${route}`, () => {
//     it('it should return unauthorized if user is not logged in', (done) => {
//       chai.request(app)
//         .get(route)
//         .end((error, res) => {
//           res.should.have.status(401);
//           res.body.should.be.an('object');
//           res.body.should.have.property('status').eql('error');
//           res.body.should.have.property('error').eql('Not authorized to access data');
//           done();
//         });
//     });

//     it('it should not return an unauthorized error if user is not an admin or moderator', (done) => {
//       chai.request(app)
//         .get(route)
//         .set('x-access-token', staffToken)
//         .end((error, res) => {
//           res.body.should.be.an('object');
//           res.body.should.have.property('status').eql('success');
//           res.body.should.have.property('data');
//           done();
//         });
//     });

//     it('it should return an invalid token error if token provided is not valid', (done) => {
//       chai.request(app)
//         .get(route)
//         .set('x-access-token', 'invalidToken')
//         .end((error, res) => {
//           res.should.have.status(401);
//           res.body.should.be.an('object');
//           res.body.should.have.property('status').eql('error');
//           res.body.should.have.property('error').eql('Not authorized to access data');
//           done();
//         });
//     });

//     it('should get all past question categories successfully', (done) => {
//       chai.request(app)
//         .get(route)
//         .set('x-access-token', adminToken)
//         .end((error, res) => {
//           res.body.should.be.an('object');
//           res.body.should.have.property('status').eql('success');
//           res.body.should.have.property('data');
//           Object.keys(res.body).length.should.be.eql(2);
//           done();
//         });
//     });

//     describe('FAKE INTERNAL SERVER ERROR', () => {
//       let stub;
//       before(() => {
//         stub = sinon.stub(Response, 'Success').throws(new Error('error'));
//       });
//       after(() => {
//         stub.restore();
//       });
//       it('returns status of 500', (done) => {
//         chai
//           .request(app)
//           .get(route)
//           .set('token', adminToken)
//           .end((err, res) => {
//             res.should.have.status(500);
//             res.body.should.have
//               .property('error')
//               .to.equals('Could not return past question categories.');
//             done();
//           });
//       });
//     });
//   });
// });
