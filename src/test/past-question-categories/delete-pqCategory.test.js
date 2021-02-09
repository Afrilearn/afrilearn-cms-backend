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
  lastName: 'Kate',
  role: 'moderator',
  email: 'loiskate@test.com',
  password: bcrypt.hashSync('password123', 10)
};

const testStaffUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'staff',
  email: 'janedoe@example.com',
  password: bcrypt.hashSync('password123', 10)
};

const testPQCategroy = {
  name : 'TestPQ2',
  categoryId : 2
}

let adminUser;
let staffUser;
let adminToken;
let staffToken;
let pqCategory;

const route = '/api/v1/pqcategory';

beforeEach(async () => {
  adminUser = await CmsUser.create(testAdminUser);
  adminToken = Helper.generateToken({id: adminUser._id, role: adminUser.role, firstName: adminUser.firstName});
  staffUser = await CmsUser.create(testStaffUser);
  staffToken = Helper.generateToken({id: staffUser._id, role: staffUser.role, firstName: staffUser.firstName});
  pqCategory = await PQCategory.create(testPQCategroy);  
});
afterEach(async () => {
      await CmsUser.deleteMany({ _id: adminUser._id });
      await CmsUser.deleteMany({ _id: staffUser._id });
      await PQCategory.deleteMany({ name: testPQCategroy.name});
    });

describe('DELETE PAST QUESTION CATEGORY', () => {
  describe(`/DELETE ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .delete(`${route}/${pqCategory._id}`)
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
            .delete(`${route}/${pqCategory._id}`)
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
            .delete(`${route}/${pqCategory._id}`)
            .set('x-access-token', 'invalidToken')
            .end((error, res) => {
              res.should.have.status(401);
              res.body.should.be.an('object');
              res.body.should.have.property('status').eql('error');
              res.body.should.have.property('error').eql('Invalid authentication token.');
              done();        
        });
    });

    it('should delete a past question category successfully', (done) => {
      chai.request(app)
        .delete(`${route}/${pqCategory._id}`)
        .set('x-access-token', adminToken)
        .end((error, res) => { 
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('message').eql('past question category deleted successfully');
          done();
    });
  });

  it('should fail to delete past question category that is not existing', async() => {
    const res = await chai.request(app)
      .delete(`${route}/${adminUser._id}`)
      .set('x-access-token', adminToken)

    expect(res.status).to.equal(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.have.property('message');
    expect(res.body.status).to.equal('error');
    expect(res.body.error.message).to.eql('category does not exist');
});

  it('should fail to delete past question category with invalid Id', async() => {
    const res = await chai.request(app)
      .delete(`${route}/546565`)
      .set('x-access-token', adminToken)

    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    expect(res.body).to.have.property('error');
    expect(res.body.status).to.equal('error');
    expect(res.body.error).to.eql('CategoryId is invalid');
  });

    it('fakes server error', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };
      sinon.stub(res, 'status').returnsThis();
      PQCategoryController.deleteCategory(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
});
