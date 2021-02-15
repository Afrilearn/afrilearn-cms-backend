import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import mongoose from 'mongoose';
import app from '../../index';
import userUtils from '../../utils/user.utils';
import PQCategory from '../../db/models/pastQuestionTypes.model';
import Response from '../../utils/response.utils';

chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const { expect } = chai;

const staffToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209ab2792e63fc841de3c',
  'Staff User',
);
const adminToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209d72792e63fc841de3e',
  'Administrator User',
);

const testPQCategory = {
  name: 'TestPQ',
  categoryId: 1,
};
const route = '/api/v1/pqcategory';

describe('ADD PAST QUESTION CATEGORY', () => {
  after(async () => {
    await PQCategory.deleteMany({ name: testPQCategory.name });
  });

  describe(`/POST ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .post(route)
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Not authorized to access data');
          done();
        });
    });

    it('it should return an unauthorized error if user is not an admin or moderator', (done) => {
      chai.request(app)
        .post(route)
        .set('x-access-token', staffToken)
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Not authorized to access data');
          done();
        });
    });

    it('it should return an invalid token error if token provided is not valid', (done) => {
      chai.request(app)
        .post(route)
        .set('x-access-token', 'invalidToken')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Not authorized to access data');
          done();
        });
    });

    it('should add a past question category successfully', (done) => {
      chai.request(app)
        .post(route)
        .set('x-access-token', adminToken)
        .send({
          name: testPQCategory.name,
          categoryId: testPQCategory.categoryId,
        })
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data').to.be.an('object');
          res.body.data.should.have.property('name').eql(testPQCategory.name);
          done();
        });
    });

    describe('CATEGORY ALREADY EXISTS', () => {
      beforeEach((done) => {
        PQCategory.create(testPQCategory, (err) => {
          if (!err) done();
        });
      });
      it('should send back 409 status with error if catgeory exists', (done) => {
        chai
          .request(app)
          .post(route)
          .set('token', adminToken)
          .send({
            name: testPQCategory.name,
            categoryId: testPQCategory.categoryId,
          })
          .end((err, res) => {
            res.status.should.equals(409);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('category already exists');
            done();
          });
      });
    });

    it('should fail to add past question category with no name field in request', async () => {
      const res = await chai.request(app)
        .post(route)
        .set('x-access-token', adminToken)
        .send({ categoryId: testPQCategory.categoryId });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.contain('Invalid Request');
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('errors');
      expect(res.body).to.be.an('object');
      expect(res.body.errors).to.be.an.instanceOf(Array);
      expect(res.body.errors).to.include.members(['Category Name is required']);
    });

    it('should fail to add past question category with no category Id field in request', async () => {
      const res = await chai.request(app)
        .post(route)
        .set('x-access-token', adminToken)
        .send({ name: testPQCategory.name });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.contain('Invalid Request');
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('errors');
      expect(res.body).to.be.an('object');
      expect(res.body.errors).to.be.an.instanceOf(Array);
      expect(res.body.errors).to.include.members(['CategoryId is required']);
    });

    it('should fail to add category with empty name string', async () => {
      const res = await chai.request(app)
        .post(route)
        .set('x-access-token', adminToken)
        .send({ name: '', categoryId: testPQCategory.categoryId });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.contain('Invalid Request');
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('errors');
      expect(res.body).to.be.an('object');
      expect(res.body.errors).to.be.an.instanceOf(Array);
      expect(res.body.errors).not.to.include.members(['Category Name is required']);
      expect(res.body.errors).to.include.members(['Category Name cannot be empty']);
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
          .post(route)
          .set('token', adminToken)
          .send({ name: 'A test category', categoryId: 5 })
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not add category');
            done();
          });
      });
    });
  });
});
