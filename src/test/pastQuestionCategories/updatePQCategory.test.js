import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import mongoose from 'mongoose';
import userUtils from '../../utils/user.utils';
import PQCategory from '../../db/models/pastQuestionTypes.model';
import Response from '../../utils/response.utils';

chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const { expect } = chai;

const invalidId = '602209ab2792e63fc841de3c';
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
  name: 'TestPQ4',
  categoryId: 4,
};

let pqCategory;

const route = '/api/v1/pqcategory';

describe('UPDATE A PAST QUESTION CATEGORY', () => {
  beforeEach(async () => {
    await PQCategory.deleteMany();
    pqCategory = await PQCategory.create(testPQCategory);
  });
  afterEach(async () => {
    await PQCategory.deleteMany({ name: testPQCategory.name });
  });
  describe(`/PUT ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .put(`${route}/${pqCategory._id}`)
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
        .put(`${route}/${pqCategory._id}`)
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
        .put(`${route}/${pqCategory._id}`)
        .set('x-access-token', 'invalidToken')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Not authorized to access data');
          done();
        });
    });

    it('should update a past question category successfully', (done) => {
      chai.request(app)
        .put(`${route}/${pqCategory._id}`)
        .set('x-access-token', adminToken)
        .send({ name: 'TestCategory' })
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('message').eql('category updated successfully');
          done();
        });
    });

    it('should fail to update a past question category that is not existing', async () => {
      const res = await chai.request(app)
        .put(`${route}/${invalidId}`)
        .set('x-access-token', adminToken)
        .send({ categoryId: 12 });

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.eql('category does not exist');
    });

    it('should fail to update a past question category with invalid Id', async () => {
      const res = await chai.request(app)
        .put(`${route}/546565`)
        .set('x-access-token', adminToken)
        .send({ name: 'TestCategory' });

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
          .put(`${route}/${pqCategory._id}`)
          .set('token', adminToken)
          .send({ name: 'TestCategory60' })
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not update category');
            done();
          });
      });
    });
  });
});
