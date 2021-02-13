import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import MainSubjects from '../../db/models/mainSubjects.model';
import userUtils from '../../utils/user.utils';
import Response from '../../utils/response.utils';

import app from '../../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const subject = {
  name: 'Maths',
  introText: 'Maths is all around us',
  classification: 'Calculation',
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

const baseUrl = '/api/v1/majorsubject';

describe(`/GET ${baseUrl}`, () => {
  describe('Successful fetch', () => {
    before(async () => {
      await MainSubjects.deleteMany();
      const subjects = [];
      for (let i = 1; i < 4; i += 1) {
        subjects.push(
          (async () => {
            await MainSubjects.create({ ...subject, name: `Maths${i}` });
          })(),
        );
      }
      await Promise.all(subjects);
    });
    after((done) => {
      MainSubjects.deleteMany((err) => {
        if (!err) done();
      });
    });
    it('should fetch all subjects for an admin', (done) => {
      chai
        .request(app)
        .get(baseUrl)
        .set('token', adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status').to.equals('success');
          res.body.data.should.have.property('subjects');
          res.body.data.subjects.length.should.equals(3);
          const names = res.body.data.subjects.map((subject) => subject.name);
          for (let i = 1; i < 4; i += 1) {
            names.should.include(`Maths${i}`);
          }
          done();
        });
    });
    it('should fetch all subjects for a moderator', (done) => {
      chai
        .request(app)
        .get(baseUrl)
        .set('token', moderatorToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status').to.equals('success');
          res.body.data.should.have.property('subjects');
          res.body.data.subjects.length.should.equals(3);
          const names = res.body.data.subjects.map((subject) => subject.name);
          for (let i = 1; i < 4; i += 1) {
            names.should.include(`Maths${i}`);
          }
          done();
        });
    });
    it('should fetch all subjects for a staff', (done) => {
      chai
        .request(app)
        .get(baseUrl)
        .set('token', staffToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status').to.equals('success');
          res.body.data.should.have.property('subjects');
          res.body.data.subjects.length.should.equals(3);
          const names = res.body.data.subjects.map((subject) => subject.name);
          for (let i = 1; i < 4; i += 1) {
            names.should.include(`Maths${i}`);
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
            .to.equals('Error fetching subjects');
          done();
        });
    });
  });

  describe('Token Validation', () => {
    it('should return 401 with error message if no token is provided', (done) => {
      chai
        .request(app)
        .get(baseUrl)
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
        .get(baseUrl)
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
});
