import chai from 'chai';
import mongoose from 'mongoose';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import aws from 'aws-sdk';
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
  name: 'TestSubject',
  imageUrl: 'testimage@url.com',
  introText: 'This is test subject',
  classification: 'classification',
};

const testSubject2 = {
  name: 'TestSubjectMaths',
  imageUrl: 'testimage@url.com',
  introText: 'This is test subject',
  classification: 'Classification',
};

<<<<<<< HEAD
const route = '/api/v1/main-subjects';
=======
const route = '/api/v1/major-subjects';
>>>>>>> develop

after(async () => {
  await MajorSubject.deleteMany({ name: testSubject.name });
  await MajorSubject.deleteMany({ name: testSubject2.name });
});

describe('ADD A MAJOR SUBJECT', () => {
  describe(`/POST ${route}`, () => {
    describe('SUCCESSFUL CREATION', () => {
      let uploadedFile;
      after(async () => {
        const s3 = new aws.S3();
        aws.config.setPromisesDependency();
        aws.config.update({
          secretAccessKey: process.env.S3_ACCESS_SECRET,
          accessKeyId: process.env.S3_ACCESS_KEY,
          region: 'us-east-1',
        });
        const params = {
          Bucket: 'afrilearn',
          Key: `subject-images/${uploadedFile}`,
        };

        await s3.deleteObject(params).promise();
      });
      it('should add a major subject successfully', (done) => {
        const image = {
          path: './src/test/images/test.jpg',
          name: 'test.jpg',
        };
        chai
          .request(app)
          .post(route)
          .set('x-access-token', adminToken)
          .field('name', testSubject.name)
          .field('introText', testSubject.introText)
          .attach('media', image.path, image.name)
          .end((error, res) => {
            res.should.have.status(201);
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('data').to.be.an('object');
            res.body.data.should.have.property('subject').to.be.an('object');
            res.body.data.subject.should.have
              .property('name')
              .eql(testSubject.name);
            res.body.data.subject.should.have
              .property('imageUrl')
              .to.include(image.name);
            res.body.data.subject.should.have
              .property('introText')
              .eql(testSubject.introText);
            const file = res.body.data.subject.imageUrl;
            uploadedFile = file.slice(file.lastIndexOf('/') + 1);
            done();
          });
      });
    });
    it('it should return unauthorized if user is not logged in', (done) => {
      chai
        .request(app)
        .post(route)
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have
            .property('error')
            .eql('Not authorized to access data');
          done();
        });
    });

    it('it should return an unauthorized error if user is not an admin or moderator', (done) => {
      chai
        .request(app)
        .post(route)
        .set('x-access-token', staffToken)
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have
            .property('error')
            .eql('Not authorized to access data');
          done();
        });
    });

    it('it should return an invalid token error if token provided is not valid', (done) => {
      chai
        .request(app)
        .post(route)
        .set('x-access-token', 'invalidToken')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have
            .property('error')
            .eql('Not authorized to access data');
          done();
        });
    });

    it('should fail to add a subject with no name field in request', async () => {
      const res = await chai
        .request(app)
        .post(route)
        .set('x-access-token', adminToken)
        .send({ introText: testSubject.introText });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('errors');
      expect(res.body).to.be.an('object');
      expect(res.body.errors).to.be.an.instanceOf(Array);
      expect(res.body.errors).to.include.members(['Subject Name is required']);
    });

    it('should fail to add a subject with empty name string', async () => {
      const res = await chai
        .request(app)
        .post(route)
        .set('x-access-token', adminToken)
        .send({ name: '', classification: testSubject.classification });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.eql('error');
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('errors');
      expect(res.body).to.be.an('object');
      expect(res.body.errors).to.be.an.instanceOf(Array);
      expect(res.body.errors).not.to.include.members([
        'Subject Name is required',
      ]);
      expect(res.body.errors).to.include.members([
        'Subject Name cannot be empty',
      ]);
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
        .post(route)
        .set('token', adminToken)
        .send(testSubject2)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property('error')
            .to.equals('Could not add subject');
          done();
        });
    });
  });

  describe('SUBJECT ALREADY EXISTS CONFLICT ERROR', () => {
    beforeEach((done) => {
      MajorSubject.create(testSubject, (err) => {
        if (!err) done();
      });
    });
    it('should send back 409 status with error if major subject exists', (done) => {
      chai
        .request(app)
        .post(route)
        .set('token', adminToken)
        .send(testSubject)
        .end((err, res) => {
          res.status.should.equals(409);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('error')
            .to.equals('subject already exists');
          done();
        });
    });
  });
});
