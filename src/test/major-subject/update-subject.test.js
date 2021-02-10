import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import MajorSubject from '../../db/models/mainSubjects.model';
import Helper from '../../utils/user.utils';
import Response from '../../utils/response.utils';
import CmsUser from '../../db/models/cmsUsers.model';

chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const { expect } = chai;

const testAdminUser = {
  firstName: 'Adams',
  lastName: 'Joseph',
  role: 'admin',
  email: 'adamsjoseph@test.com',
  password: bcrypt.hashSync('password123', 10),
};

const testStaffUser = {
  firstName: 'Janet',
  lastName: 'Bush',
  role: 'staff',
  email: 'janetbush@example.com',
  password: bcrypt.hashSync('password123', 10),
};

const testSubject = {
  name: 'TestSubject3',
  imageUrl: 'testimage@url.com',
  introText: 'This is test subject',
  classification: 'Classification',
};

let adminUser;
let staffUser;
let adminToken;
let staffToken;
let subject;

const route = '/api/v1/majorsubject';

before(async () => {
  await CmsUser.deleteOne({ email: testAdminUser.email });
  await CmsUser.deleteOne({ email: testStaffUser.email });
  adminUser = await CmsUser.create(testAdminUser);
  adminToken = Helper.generateToken({
    id: adminUser._id, role: adminUser.role, firstName: adminUser.firstName,
  });
  staffUser = await CmsUser.create(testStaffUser);
  staffToken = Helper.generateToken({
    id: staffUser._id, role: staffUser.role, firstName: staffUser.firstName,
  });
  subject = await MajorSubject.create(testSubject);
});
after(async () => {
  await CmsUser.deleteMany({ _id: adminUser._id });
  await CmsUser.deleteMany({ _id: staffUser._id });
  await MajorSubject.deleteMany({ name: testSubject.name });
});

describe('UPDATE A MAJOR SUBJECT', () => {
  describe(`/PUT ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .put(`${route}/${subject._id}`)
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('No token provided!');
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
          res.body.should.have.property('error').eql('You are not permitted to perform this action');
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
          res.body.should.have.property('error').eql('Invalid authentication token.');
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
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('message').eql('subject updated successfully');
          done();
        });
    });

    it('should update a major subject successfully with bearer token', (done) => {
      chai.request(app)
        .put(`${route}/${subject._id}`)
        .set('x-access-token', `Bearer ${adminToken}`)
        .send(testSubject)
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('message').eql('subject updated successfully');
          done();
        });
    });

    it('should fail to update a major subject that is not existing', async () => {
      const res = await chai.request(app)
        .put(`${route}/${staffUser._id}`)
        .set('x-access-token', adminToken)
        .send({ categoryId: 12 });

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('message');
      expect(res.body.status).to.equal('error');
      expect(res.body.error.message).to.eql('subject does not exist');
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
