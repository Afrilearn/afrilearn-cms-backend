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
  name: 'TestSubjectAnother',
  imageUrl: 'testimage@url.com',
  introText: 'This is test subject',
  classification: 'Classification',
};

let subject;

const route = '/api/v1/main-subjects';

describe('UPDATE A MAJOR SUBJECT', () => {
  before(async () => {
    subject = await MajorSubject.create(testSubject);
  });
  after(async () => {
    await MajorSubject.deleteMany({ name: testSubject.name });
  });
  describe(`/PUT ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .put(`${route}/${subject._id}`)
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
        .put(`${route}/${subject._id}`)
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
        .put(`${route}/${subject._id}`)
        .set('x-access-token', 'invalidToken')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Not authorized to access data');
          done();
        });
    });

    it('should update a major subject successfully', (done) => {
      chai.request(app)
        .put(`${route}/${subject._id}`)
        .set('x-access-token', adminToken)
        .send(testSubject)
        .end((error, res) => {
          res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('mainSubject');
            res.body.data.mainSubject.should.have
              .property('name')
              .to.equals(testSubject.name);
            done();
        });
    });

    it('should fail to update a major subject that is not existing', async () => {
      const res = await chai.request(app)
        .put(`${route}/602209d72792e63fc841de3e`)
        .set('x-access-token', adminToken)
        .send({ categoryId: 12 });

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.eql('subject does not exist');
    });

    it('should fail to update a major subject with invalid Id', async () => {
      const res = await chai.request(app)
        .put(`${route}/546565`)
        .set('x-access-token', adminToken)
        .send({ name: 'Subject update test' });

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
        .put(`${route}/${subject._id}`)
        .set('token', adminToken)
        .send(testSubject)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property('error')
            .to.equals('Could not update subject');
          done();
        });
    });
  });
});
