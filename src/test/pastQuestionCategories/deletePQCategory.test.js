// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import sinon from 'sinon';
// import Sinonchai from 'sinon-chai';
// import app from '../../index';
// import mongoose from 'mongoose';
// import userUtils from '../../utils/user.utils';
// import PQCategory from '../../db/models/pastQuestionTypes.model';
// import Response from '../../utils/response.utils';

// chai.use(chaiHttp);
// chai.should();
// chai.use(Sinonchai);

// const { expect } = chai;

// const invalidToken = 'invalid.jwt.token';
// const invalidId = '602209c32792e63fc841de3d';
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

// const testPQCategory = {
//   name: 'TestPQ2',
//   categoryId: 2,
// };

// let pqCategory;

// const route = '/api/v1/pqcategory';

// describe('DELETE A PAST QUESTION CATEGORY', () => {
//   beforeEach(async () => {
//     await PQCategory.deleteMany();
//     pqCategory = await PQCategory.create(testPQCategory);
//   });
//   afterEach(async () => {
//     await PQCategory.deleteMany({ name: testPQCategory.name });
//   });
//   describe(`/DELETE ${route}`, () => {
//     it('it should return unauthorized if user is not logged in', (done) => {
//       chai.request(app)
//         .delete(`${route}/${pqCategory._id}`)
//         .end((error, res) => {
//           res.should.have.status(401);
//           res.body.should.be.an('object');
//           res.body.should.have.property('status').eql('error');
//           res.body.should.have.property('error').eql('Not authorized to access data');
//           done();
//         });
//     });

//     it('it should return an unauthorized error if user is not an admin or moderator', (done) => {
//       chai.request(app)
//         .delete(`${route}/${pqCategory._id}`)
//         .set('x-access-token', staffToken)
//         .end((error, res) => {
//           res.should.have.status(401);
//           res.body.should.be.an('object');
//           res.body.should.have.property('status').eql('error');
//           res.body.should.have.property('error').eql('Not authorized to access data');
//           done();
//         });
//     });

//     it('it should return an invalid token error if token provided is not valid', (done) => {
//       chai.request(app)
//         .delete(`${route}/${pqCategory._id}`)
//         .set('x-access-token', 'invalidToken')
//         .end((error, res) => {
//           res.should.have.status(401);
//           res.body.should.be.an('object');
//           res.body.should.have.property('status').eql('error');
//           res.body.should.have.property('error').eql('Not authorized to access data');
//           done();
//         });
//     });

//     it('should delete a past question category successfully', (done) => {
//       chai.request(app)
//         .delete(`${route}/${pqCategory._id}`)
//         .set('x-access-token', adminToken)
//         .end((error, res) => {
//           res.should.have.status(200);
//           res.body.should.be.an('object');
//           res.body.should.have.property('status').eql('success');
//           res.body.data.should.have.property('message').eql('past question category deleted successfully');
//           done();
//         });
//     });

//     it('should fail to delete past question category that is not existing', async () => {
//       const res = await chai.request(app)
//         .delete(`${route}/${invalidId}`)
//         .set('x-access-token', adminToken);

//       expect(res.status).to.equal(404);
//       expect(res.body).to.be.an('object');
//       expect(res.body).to.have.property('status');
//       expect(res.body).to.have.property('error');
//       expect(res.body.status).to.equal('error');
//       expect(res.body.error).to.eql('category does not exist');
//     });

//     it('should fail to delete past question category with invalid Id', async () => {
//       const res = await chai.request(app)
//         .delete(`${route}/546565`)
//         .set('x-access-token', adminToken);

//       expect(res.status).to.equal(400);
//       expect(res.body).to.be.an('object');
//       expect(res.body).to.have.property('status');
//       expect(res.body).to.have.property('error');
//       expect(res.body.status).to.equal('error');
//       expect(res.body.error).to.eql('CategoryId is invalid');
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
//           .delete(`${route}/${pqCategory._id}`)
//           .set('token', adminToken)
//           .end((err, res) => {
//             res.should.have.status(500);
//             res.body.should.have
//               .property('error')
//               .to.equals('Could not delete category');
//             done();
//           });
//       });
//     });
//   });
// });
