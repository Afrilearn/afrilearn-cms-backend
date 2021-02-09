import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import CmsUser from '../../db/models/cmsUsers.model';
import PQCategory from '../../db/models/pastQuestionTypes.model'
import Helper from '../../utils/user.utils';
import PQCategoryController from '../../controllers/pastquestions_category.controller';

chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const { expect } = chai;

const testAdminUser = {
  firstName: 'Lois',
  lastName: 'Adegbohungbe',
  role: 'admin',
  email: 'loisdex@test.com',
  password: bcrypt.hashSync('password123', 10)
};

const testStaffUser = {
  firstName: 'Louis',
  lastName: 'Doe',
  role: 'staff',
  email: 'loisdoe@example.com',
  password: bcrypt.hashSync('password123', 10)
};

const testPQCategroy = {
  name : 'TestPQ',
  categoryId : 1
}

let adminUser;
let staffUser;
let adminToken;
let staffToken;
const route = '/api/v1/pqcategory';

beforeEach(async () => {
  adminUser = await CmsUser.create(testAdminUser);
  adminToken = Helper.generateToken({id: adminUser._id, role: adminUser.role, firstName: adminUser.firstName});
  staffUser = await CmsUser.create(testStaffUser);
  staffToken = Helper.generateToken({id: staffUser._id, role: staffUser.role, firstName: staffUser.firstName});
});
afterEach(async () => {
      await CmsUser.deleteMany({ _id: adminUser._id });
      await CmsUser.deleteMany({ _id: staffUser._id });
      await PQCategory.deleteMany({ name: testPQCategroy.name});
    });

describe('ADD PAST QUESTION CATEGORY', () => {
  describe(`/POST ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .post(route)
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
            .post(route)
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
            .post(route)
            .set('x-access-token', 'invalidToken')
            .end((error, res) => {
              res.should.have.status(401);
              res.body.should.be.an('object');
              res.body.should.have.property('status').eql('error');
              res.body.should.have.property('error').eql('Invalid authentication token.');
              done();        
        });
    });

    it('should add a past question category successfully', (done) => {
      chai.request(app)
        .post(route)
        .set('x-access-token', adminToken)
        .send({
          name: testPQCategroy.name,
          categoryId: testPQCategroy.categoryId,
        })
        .end((error, res) => { 
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data').to.be.an('object');
          res.body.data.should.have.property('name').eql(testPQCategroy.name);
          done();
    });
  });

  it('should fail to add past question category with no name field in request', async () => {
    const res = await chai.request(app)
      .post(route)
      .set('x-access-token', adminToken)
      .send({ categoryId: testPQCategroy.categoryId });

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
      .send({ name: testPQCategroy.name });

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
      .send({ name: '', categoryId: testPQCategroy.categoryId });

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

    it('fakes server error', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };
      sinon.stub(res, 'status').returnsThis();
      PQCategoryController.addCategory(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
});
