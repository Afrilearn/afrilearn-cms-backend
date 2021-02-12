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

const invalidId = '602209c32792e63fc841de3d';
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

const testPQCategory = {
  name: 'TestPQ3',
  categoryId: 3,
};

let pqCategory;

const route = '/api/v1/pqcategory';

describe('GET A PAST QUESTION CATEGORY', () => {
  before(async () => {
    pqCategory = await PQCategory.create(testPQCategory);
  });
  after(async () => {
    await PQCategory.deleteMany({ name: testPQCategory.name });
  });
  describe(`/GET ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .get(`${route}/${pqCategory._id}`)
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Not authorized to access data');
          done();
        });
    });

    it('it should return successful if user is not an admin or moderator', (done) => {
      chai.request(app)
        .get(`${route}/${pqCategory._id}`)
        .set('x-access-token', staffToken)
        .end((error, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('name').eql(testPQCategory.name);
          done();
        });
    });

    it('it should return an invalid token error if token provided is not valid', (done) => {
      chai.request(app)
        .get(`${route}/${pqCategory._id}`)
        .set('x-access-token', 'invalidToken')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Not authorized to access data');
          done();
        });
    });

    it('should get a past question category successfully', (done) => {
      chai.request(app)
        .get(`${route}/${pqCategory._id}`)
        .set('x-access-token', adminToken)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('name').eql(testPQCategory.name);
          done();
        });
    });

    it('should fail to get past question category that is not existing', async () => {
      const res = await chai.request(app)
        .get(`${route}/${invalidId}`)
        .set('x-access-token', adminToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.eql('past questions category not found');
    });

    it('should fail to get past question category with invalid Id', async () => {
      const res = await chai.request(app)
        .get(`${route}/546565`)
        .set('x-access-token', adminToken);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.eql('CategoryId is invalid');
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
          .get(`${route}/${pqCategory._id}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not get category');
            done();
          });
      });
    });
  });
});
