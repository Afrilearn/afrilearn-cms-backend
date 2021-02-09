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
  firstName: 'Mary',
  lastName: 'Jane',
  role: 'admin',
  email: 'maryjane@test.com',
  password: bcrypt.hashSync('password123', 10)
};

const testStaffUser = {
  firstName: 'Louissa',
  lastName: 'Martins',
  role: 'staff',
  email: 'louissamartins@example.com',
  password: bcrypt.hashSync('password123', 10)
};

const testPQCategroy1 = {
  name : 'TestPQ5',
  categoryId : 5
}

const testPQCategroy2 = {
    name : 'TestPQ6',
    categoryId : 6
}

const testPQCategroy3 = {
    name : 'TestPQ7',
    categoryId : 7
}

let adminUser;
let staffUser;
let adminToken;
let staffToken;
let pqCategory1;
let pqCategory2;
let pqCategory3;

const route = '/api/v1/pqcategory';

beforeEach(async () => {
  adminUser = await CmsUser.create(testAdminUser);
  adminToken = Helper.generateToken({id: adminUser._id, role: adminUser.role, firstName: adminUser.firstName});
  staffUser = await CmsUser.create(testStaffUser);
  staffToken = Helper.generateToken({id: staffUser._id, role: staffUser.role, firstName: staffUser.firstName});
  pqCategory1 = await PQCategory.create(testPQCategroy1);  
  pqCategory2 = await PQCategory.create(testPQCategroy2);  
  pqCategory3 = await PQCategory.create(testPQCategroy3);  
});
afterEach(async () => {
      await CmsUser.deleteMany({ _id: adminUser._id });
      await CmsUser.deleteMany({ _id: staffUser._id });
      await PQCategory.deleteMany({ name: testPQCategroy1.name});
      await PQCategory.deleteMany({ name: testPQCategroy2.name});
      await PQCategory.deleteMany({ name: testPQCategroy3.name});
    });

describe('GET ALL PAST QUESTION CATEGORIES', () => {
  describe(`/GET ${route}`, () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .get(route)
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('No token provided!');
          done();
        });
    });

    it('it should not return an unauthorized error if user is not an admin or moderator', (done) => {
        chai.request(app)
        .get(route)
        .set('x-access-token', staffToken)
        .end((error, res) => {
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('data');
          done();        
        });
    });

    it('it should return an invalid token error if token provided is not valid', (done) => {
      chai.request(app)
            .get(route)
            .set('x-access-token', 'invalidToken')
            .end((error, res) => {
              res.should.have.status(401);
              res.body.should.be.an('object');
              res.body.should.have.property('status').eql('error');
              res.body.should.have.property('error').eql('Invalid authentication token.');
              done();        
        });
    });

    it('should get all past question categories successfully', (done) => {
        chai.request(app)
        .get(route)
        .set('x-access-token', adminToken)
        .end((error, res) => {
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql('success');
            res.body.should.have.property('data');
          done();        
    });
  });

    it('fakes server error', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };
      sinon.stub(res, 'status').returnsThis();
      PQCategoryController.getAllCategories(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
});
