import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import MajorSubject from '../../db/models/mainSubjects.model';
import Helper from '../../utils/user.utils';
import Response from '../../utils/response.utils';

chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const { expect } = chai;

const staffToken = Helper.generateToken(
  mongoose.Types.ObjectId(),
  '602209ab2792e63fc841de3c',
  'Staff User',
);
const adminToken = Helper.generateToken(
  mongoose.Types.ObjectId(),
  '602209d72792e63fc841de3e',
  'Administrator User',
);

const testSubject = {
  name: 'TestSubject2',
  imageUrl: 'testimage@url.com',
  introText: 'This is test subject',
  classification: 'Classification',
};

const testSubject2 = {
  name: 'TestSubjectAlso',
  imageUrl: 'testimage@url.com',
  introText: 'This is test subject',
  classification: 'Classification',
};

let subject;
let subject2;

const route = '/api/v1/major-subjects';

describe('DELETE A MAJOR SUBJECT', () => {
  before(async () => {
    subject = await MajorSubject.create(testSubject);
    subject2 = await MajorSubject.create(testSubject2);
  });
  after(async () => {
    await MajorSubject.deleteMany({ name: testSubject.name });
    await MajorSubject.deleteMany({ name: testSubject2.name });
  });
  describe(`/DELETE ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .delete(`${route}/${subject._id}`)
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
        .delete(`${route}/${subject._id}`)
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
        .delete(`${route}/${subject._id}`)
        .set('x-access-token', 'invalidToken')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Not authorized to access data');
          done();
        });
    });

    it('should delete a major subject successfully', (done) => {
      chai.request(app)
        .delete(`${route}/${subject._id}`)
        .set('x-access-token', adminToken)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('message').eql(`${testSubject.name} subject deleted successfully`);
          done();
        });
    });

    it('should fail to delete a major subject that is not existing', async () => {
      const res = await chai.request(app)
        .delete(`${route}/602209d72792e63fc841de3e`)
        .set('x-access-token', adminToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.eql('major subject does not exist');
    });

    it('should fail to delete a major subject with invalid Id', async () => {
      const res = await chai.request(app)
        .delete(`${route}/546565`)
        .set('x-access-token', adminToken);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.eql('mainSubjectId is invalid');
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
        .delete(`${route}/${subject2._id}`)
        .set('token', adminToken)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property('error')
            .to.equals('Could not delete subject');
          done();
        });
    });
  });
});
