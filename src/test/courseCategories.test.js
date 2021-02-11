import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';
import CourseCategories from '../db/models/courseCategories.model';

import app from '../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const unhashedPassword = '12345678';
userUtils.encryptPassword(unhashedPassword).then((password) => {
  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    password,
    role: '5fc8f4b99d1e3023e4942152',
  };
});

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

const baseUrl = '/api/v1/course_categories';
const name = 'Course category';

describe('POST/ course_categories', () => {
  beforeEach((done) => {
    CourseCategories.deleteMany((err) => {
      if (!err) done();
    });
  });
  afterEach((done) => {
    CourseCategories.deleteMany((err) => {
      if (!err) done();
    });
  });
  describe('SUCCESSFULLY CREATE COURSE CATEGORY', () => {
    beforeEach((done) => {
      CourseCategories.deleteMany((err) => {
        if (!err) done();
      });
    });
    afterEach((done) => {
      CourseCategories.deleteMany((err) => {
        if (!err) done();
      });
    });
    it('should create course category successfully for admin', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', adminToken)
        .send({ name })
        .end((err, res) => {
          res.status.should.equals(201);
          res.body.data.courseCategory.should.have
            .property('name')
            .to.equals('Course category');
          done();
        });
    });
    it('should create course category successfully for moderator', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', moderatorToken)
        .send({ name })
        .end((err, res) => {
          res.status.should.equals(201);
          res.body.data.courseCategory.should.have
            .property('name')
            .to.equals('Course category');
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
    it('should return 500 status', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', adminToken)
        .send({ name })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property('error')
            .to.equals('Error creating course category');
          done();
        });
    });
  });

  describe('TOKEN VALIDATION', () => {
    it('should return 401 with error message if no token is provided', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .send({ name })
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
        .post(baseUrl)
        .set('token', invalidToken)
        .send({ name })
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

  describe('ADMIN ACCESS', () => {
    it('should return 401 with error if user is not moderator or admin', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', staffToken)
        .send({ name })
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

  describe('INPUT VALIDATION', () => {
    let request;
    beforeEach(() => {
      request = chai.request(app).post(baseUrl).set('token', adminToken);
    });
    it('should not create course category if name field is not provided', (done) => {
      request.send({}).end((err, res) => {
        res.status.should.equals(400);
        res.body.status.should.equals('error');
        res.body.should.have
          .property('errors')
          .to.include('Category name is required');
        done();
      });
    });
    it('should not create course category if name field is not a string', (done) => {
      request.send({ name: 3 }).end((err, res) => {
        res.status.should.equals(400);
        res.body.status.should.equals('error');
        res.body.should.have
          .property('errors')
          .to.include('Category name must be a string');
        done();
      });
    });
    it('should not create course category if name field is empty', (done) => {
      request.send({ name: '' }).end((err, res) => {
        res.status.should.equals(400);
        res.body.status.should.equals('error');
        res.body.should.have
          .property('errors')
          .to.include('Category name cannot be empty');
        done();
      });
    });
  });

  describe('COURSE CATEGORY INEXISTENCE', () => {
    beforeEach(async () => {
      await CourseCategories.deleteMany();
      await CourseCategories.create({ name });
    });
    afterEach((done) => {
      CourseCategories.deleteMany((err) => {
        if (!err) done();
      });
    });
    it('should return 409 if course category already exists', (done) => {
      chai
        .request(app)
        .post(baseUrl)
        .set('token', adminToken)
        .send({ name })
        .end((err, res) => {
          res.status.should.equals(409);
          res.body.status.should.equals('error');
          res.body.should.have
            .property('error')
            .to.equals('This course category already exists');
          done();
        });
    });
  });
});

describe(`PATCH/ ${baseUrl}/:courseCategoryId`, () => {
  let id;
  beforeEach(async () => {
    await CourseCategories.deleteMany();
    const dbCat = await CourseCategories.create({ name });
    id = dbCat._id;
  });
  afterEach(async () => {
    await CourseCategories.deleteMany();
  });

  describe('SUCCESSFULLY EDIT COURSE CATEGORY', () => {
    beforeEach(async () => {
      await CourseCategories.deleteMany();
      const dbCat = await CourseCategories.create({ name });
      id = dbCat._id;
    });
    afterEach(async () => {
      await CourseCategories.deleteMany();
    });
    it('should edit course category successfully for admin', (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/${id}`)
        .set('token', adminToken)
        .send({ name: 'Edited course category' })
        .end((err, res) => {
          res.status.should.equals(200);
          res.body.should.have.property('status').to.equals('success');
          res.body.data.courseCategory.should.have
            .property('name')
            .to.equals('Edited course category');
          done();
        });
    });
    it('should edit course category successfully for moderator', (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/${id}`)
        .set('token', moderatorToken)
        .send({ name: 'Edited course category' })
        .end((err, res) => {
          res.status.should.equals(200);
          res.body.should.have.property('status').to.equals('success');
          res.body.data.courseCategory.should.have
            .property('name')
            .to.equals('Edited course category');
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
    it('should return 500 status', (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/${id}`)
        .set('token', adminToken)
        .send({ name })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property('error')
            .to.equals('Error editing course category');
          done();
        });
    });
  });

  describe('TOKEN VALIDATION', () => {
    it('should return 401 with error message if no token is provided', (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/${id}`)
        .send({ name })
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
        .patch(`${baseUrl}/${id}`)
        .set('token', invalidToken)
        .send({ name })
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

  describe('ADMIN ACCESS', () => {
    it('should return 401 with error if user is not moderator or admin', (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/${id}`)
        .set('token', staffToken)
        .send({ name })
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

  describe('INPUT VALIDATION', () => {
    let request;
    beforeEach(() => {
      request = chai
        .request(app)
        .patch(`${baseUrl}/${id}`)
        .set('token', adminToken);
    });
    it('should not edit course category if name field is not provided', (done) => {
      request.send({}).end((err, res) => {
        res.status.should.equals(400);
        res.body.status.should.equals('error');
        res.body.should.have
          .property('errors')
          .to.include('Category name is required');
        done();
      });
    });
    it('should not edit course category if name field is not a string', (done) => {
      request.send({ name: 3 }).end((err, res) => {
        res.status.should.equals(400);
        res.body.status.should.equals('error');
        res.body.should.have
          .property('errors')
          .to.include('Category name must be a string');
        done();
      });
    });
    it('should not edit course category if name field is empty', (done) => {
      request.send({ name: '' }).end((err, res) => {
        res.status.should.equals(400);
        res.body.status.should.equals('error');
        res.body.should.have
          .property('errors')
          .to.include('Category name cannot be empty');
        done();
      });
    });
    it('should not create course if course category id is not a valid mongoose id', (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/invalidmongooseid`)
        .set('token', adminToken)
        .send({ name })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('courseCategoryId is not a valid mongoose ID');
          done();
        });
    });
  });

  describe('COURSE CATEGORY EXISTENCE', () => {
    beforeEach(async () => {
      await CourseCategories.deleteMany();
    });
    afterEach((done) => {
      CourseCategories.deleteMany((err) => {
        if (!err) done();
      });
    });
    it("should return 404 if course category doesn't exist", (done) => {
      chai
        .request(app)
        .patch(`${baseUrl}/${id}`)
        .set('token', adminToken)
        .send({ name })
        .end((err, res) => {
          res.status.should.equals(404);
          res.body.status.should.equals('error');
          res.body.should.have
            .property('error')
            .to.equals('This course category does not exist');
          done();
        });
    });
  });
});
