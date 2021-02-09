import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Courses from '../db/models/courses.model';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';

import app from '../index';
import RelatedPastQuestions from '../db/models/relatedPastQuestions.model';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const validCreatorId = mongoose.Types.ObjectId();
const validCategoryId = mongoose.Types.ObjectId();
const course = {
  name: 'Primary One',
  alias: 'Pri 1',
  creatorId: validCreatorId,
  categoryId: validCategoryId,
};
const courseUpdate = {
  name: 'Primary Two',
  alias: 'Pri 2',
  categoryId: validCategoryId,
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

const baseUrl = '/api/v1/courses';
describe('COURSES', () => {
  describe(`/POST ${baseUrl}`, () => {
    describe('SUCCESSFUL COURSE CREATION', () => {
      beforeEach((done) => {
        Courses.deleteMany((err) => {
          if (!err) done();
        });
      });
      afterEach((done) => {
        Courses.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should create course if request is valid and user is admin', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', adminToken)
          .send(course)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('Success');
            res.body.data.should.have.property('course');
            res.body.data.course.should.have
              .property('name')
              .to.equals(course.name);
            res.body.data.course.should.have
              .property('alias')
              .to.equals(course.alias);
            res.body.data.course.should.have
              .property('categoryId')
              .to.equals(course.categoryId.toHexString());
            res.body.data.course.should.have
              .property('creatorId')
              .to.equals(course.creatorId.toHexString());
            res.body.data.course.should.have
              .property('createdAt')
              .to.equals(res.body.data.course.updatedAt);
            done();
          });
      });
      it('should create course if request is valid and user is moderator', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', moderatorToken)
          .send(course)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('Success');
            res.body.data.should.have.property('course');
            res.body.data.course.should.have
              .property('name')
              .to.equals(course.name);
            res.body.data.course.should.have
              .property('alias')
              .to.equals(course.alias);
            res.body.data.course.should.have
              .property('categoryId')
              .to.equals(course.categoryId.toHexString());
            res.body.data.course.should.have
              .property('creatorId')
              .to.equals(course.creatorId.toHexString());
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
          .post(baseUrl)
          .set('token', adminToken)
          .send(course)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not create course');
            done();
          });
      });
    });
    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .send(course)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
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
          .send(course)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
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
          .send(course)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('INPUT VALIDATION', () => {
      let request;
      let dynamicCourse;
      beforeEach(() => {
        request = chai.request(app).post(baseUrl).set('token', adminToken);
        dynamicCourse = {
          name: 'Primary One',
          alias: 'Pri One',
          creatorId: validCreatorId,
          categoryId: validCategoryId,
        };
      });

      it('should not create course if course name is not provided', (done) => {
        delete dynamicCourse.name;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Name is required');
          done();
        });
      });
      it('should not create course if course name is empty', (done) => {
        dynamicCourse.name = '';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Name cannot be empty');
          done();
        });
      });
      it('should not create course if course name is not string', (done) => {
        dynamicCourse.name = 2;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Name must be a string');
          done();
        });
      });

      it('should not create course if course alias is not provided', (done) => {
        delete dynamicCourse.alias;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Alias is required');
          done();
        });
      });
      it('should not create course if course alias is empty', (done) => {
        dynamicCourse.alias = '';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Alias cannot be empty');
          done();
        });
      });
      it('should not create course if course alias is not string', (done) => {
        dynamicCourse.alias = 2;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Alias must be a string');
          done();
        });
      });

      it('should not create course if categoryId is not provided', (done) => {
        delete dynamicCourse.categoryId;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Category is required');
          done();
        });
      });
      it('should not create course if course categoryId is empty', (done) => {
        dynamicCourse.categoryId = '';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Category cannot be empty');
          done();
        });
      });
      it('should not create course if categoryId is not string', (done) => {
        dynamicCourse.categoryId = 2;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Category id must be a string');
          done();
        });
      });
      it('should not create course if categoryId is not a valid mongoose id', (done) => {
        dynamicCourse.categoryId = 'invalidmongooseid';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Category id is not a valid mongoose ID');
          done();
        });
      });

      it('should not create course if creatorId is not provided', (done) => {
        delete dynamicCourse.creatorId;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Creator id is required');
          done();
        });
      });
      it('should not create course if creatorId is empty', (done) => {
        dynamicCourse.creatorId = '';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Creator id cannot be empty');
          done();
        });
      });
      it('should not create course if creatorId is not a string', (done) => {
        dynamicCourse.creatorId = 2;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Creator id must be a string');
          done();
        });
      });
      it('should not create course if creatorId is not a valid mongoose id', (done) => {
        dynamicCourse.creatorId = 'invalidmongooseid';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Creator id is not a valid mongoose ID');
          done();
        });
      });
    });
    describe('COURSE INEXISTENCE', () => {
      beforeEach((done) => {
        Courses.create(course, (err) => {
          if (!err) done();
        });
      });
      it('should send back 409 status with error if course exists', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', adminToken)
          .send(course)
          .end((err, res) => {
            res.status.should.equals(409);
            res.body.should.have
              .property('status')
              .to.equals('409 Conflicting Request');
            res.body.should.have
              .property('error')
              .to.equals('Course already exists');
            done();
          });
      });
    });
  });

  describe(`/PATCH ${baseUrl}/:courseId`, () => {
    let courseId;
    beforeEach(async () => {
      await Courses.deleteMany();
      const createdCourse = await Courses.create(course);
      courseId = createdCourse._id;
    });
    afterEach((done) => {
      Courses.deleteMany((err) => {
        if (!err) done();
      });
    });
    describe('SUCCESS', () => {
      beforeEach(async () => {
        await Courses.deleteMany();
        const createdCourse = await Courses.create(course);
        courseId = createdCourse._id;
      });
      afterEach((done) => {
        Courses.deleteMany((err) => {
          if (!err) done();
        });
      });

      it('should edit course if request is valid and user is admin', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${courseId}`)
          .set('token', adminToken)
          .send(courseUpdate)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('Success');
            res.body.data.should.have.property('course');
            res.body.data.course.should.have
              .property('name')
              .to.equals(courseUpdate.name);
            res.body.data.course.should.have
              .property('alias')
              .to.equals(courseUpdate.alias);
            res.body.data.course.should.have
              .property('categoryId')
              .to.equals(courseUpdate.categoryId.toHexString());
            res.body.data.course.creatorId.should.equals(
              course.creatorId.toHexString(),
            );
            res.body.data.course.should.have.property('updatedAt');
            res.body.data.course.should.have
              .property('createdAt')
              .not.to.equals(res.body.data.course.updatedAt);
            done();
          });
      });
      it('should edit course if request is valid and user is moderator', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${courseId}`)
          .set('token', moderatorToken)
          .send(courseUpdate)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('Success');
            res.body.data.should.have.property('course');
            res.body.data.course.should.have
              .property('name')
              .to.equals(courseUpdate.name);
            res.body.data.course.should.have
              .property('alias')
              .to.equals(courseUpdate.alias);
            res.body.data.course.should.have
              .property('categoryId')
              .to.equals(courseUpdate.categoryId.toHexString());
            res.body.data.course.creatorId.should.equals(
              course.creatorId.toHexString(),
            );
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
          .patch(`${baseUrl}/${courseId}`)
          .set('token', adminToken)
          .send(courseUpdate)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not edit course');
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${courseId}`)
          .send(courseUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${courseId}`)
          .set('token', invalidToken)
          .send(courseUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
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
          .patch(`${baseUrl}/${courseId}`)
          .set('token', staffToken)
          .send(courseUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('INPUT VALIDATION', () => {
      let dynamicCourse;
      let request;
      beforeEach(() => {
        dynamicCourse = {};
        request = chai
          .request(app)
          .patch(`${baseUrl}/${courseId}`)
          .set('token', adminToken);
      });
      it('should not edit course if course name is empty', (done) => {
        dynamicCourse.name = '';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Name cannot be empty');
          done();
        });
      });
      it('should not edit course if course name is not string', (done) => {
        dynamicCourse.name = 2;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Name must be a string');
          done();
        });
      });
      it('should not edit course if course alias is empty', (done) => {
        dynamicCourse.alias = '';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Alias cannot be empty');
          done();
        });
      });
      it('should not edit course if course alias is not string', (done) => {
        dynamicCourse.alias = 2;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Alias must be a string');
          done();
        });
      });

      it('should not edit course if course categoryId is empty', (done) => {
        dynamicCourse.categoryId = '';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Category cannot be empty');
          done();
        });
      });
      it('should not edit course if categoryId is not string', (done) => {
        dynamicCourse.categoryId = 2;
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Category id must be a string');
          done();
        });
      });
      it('should not edit course if categoryId is not a valid mongoose id', (done) => {
        dynamicCourse.categoryId = 'invalidmongooseid';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Category id is not a valid mongoose ID');
          done();
        });
      });

      it('should not edit course if creatorId is provided', (done) => {
        dynamicCourse.creatorId = '';
        request.send(dynamicCourse).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Cannot change course creator');
          done();
        });
      });
    });
    describe('COURSE EXISTENCE', () => {
      beforeEach((done) => {
        Courses.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should send back 404 status with error if course does not exist', (done) => {
        chai
          .request(app)
          .patch(`${baseUrl}/${courseId}`)
          .set('token', adminToken)
          .send(courseUpdate)
          .end((err, res) => {
            res.status.should.equals(404);
            res.body.should.have.property('status').to.equals('404 Not Found');
            res.body.should.have
              .property('error')
              .to.equals('Course does not exist');
            done();
          });
      });
    });
  });

  describe(`/DELETE ${baseUrl}/:courseId`, () => {
    let courseId;
    beforeEach(async () => {
      await Courses.deleteMany();
      const createdCourse = await Courses.create(course);
      courseId = createdCourse._id;
    });
    afterEach((done) => {
      Courses.deleteMany((err) => {
        if (!err) done();
      });
    });
    describe('SUCCESSFUL DELETE', () => {
      beforeEach(async () => {
        await Courses.deleteMany();
        const createdCourse = await Courses.create(course);
        courseId = createdCourse._id;
      });
      afterEach((done) => {
        Courses.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should delete course if data is valid and user is admin', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${courseId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('Success');
            res.body.should.have.property('data');
            res.body.data.should.have
              .property('message')
              .to.equals('Course deleted successfully');
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
          .delete(`${baseUrl}/${courseId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not delete course');
            done();
          });
      });
    });
    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${courseId}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${courseId}`)
          .set('token', invalidToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
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
          .delete(`${baseUrl}/${courseId}`)
          .set('token', staffToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });
    describe('COURSE EXISTENCE', () => {
      beforeEach((done) => {
        Courses.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should send back 404 status with error if course does not exist', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${courseId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.status.should.equals(404);
            res.body.should.have.property('status').to.equals('404 Not Found');
            res.body.should.have
              .property('error')
              .to.equals('Course does not exist');
            done();
          });
      });
    });
  });

  describe(`/POST ${baseUrl}/past-question/:courseId`, () => {
    let courseId, pastQuestionId;
    beforeEach(() => {
      pastQuestionId = mongoose.Types.ObjectId();
      courseId = mongoose.Types.ObjectId();
    });
    describe('LINK PAST QUESTION SUCCESSFULLY', () => {
      let dbCourse;
      beforeEach(async () => {
        dbCourse = await Courses.create(course);
        courseId = dbCourse._id;
      });
      afterEach(async () => {
        await Courses.deleteMany({ _id: courseId });
        await RelatedPastQuestions.deleteMany({
          courseId,
          pastQuestionTypeId: pastQuestionId,
        });
      });
      it('should create a new related past question if user is admin', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/past-question/${courseId}`)
          .set('token', adminToken)
          .send({ pastQuestionId })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('Success');
            res.body.data.should.have.property('course');
            res.body.data.course.should.have
              .property('name')
              .to.equals(dbCourse.name);
            res.body.data.course.should.have
              .property('alias')
              .to.equals(dbCourse.alias);
            res.body.data.course.should.have
              .property('categoryId')
              .to.equals(dbCourse.categoryId.toHexString());
            res.body.data.course.should.have
              .property('creatorId')
              .to.equals(dbCourse.creatorId.toHexString());
            res.body.data.course.should.have
              .property('createdAt')
              .to.equals(res.body.data.course.updatedAt);
            done();
          });
        it('should create a new related past question if user is moderator', (done) => {
          chai
            .request(app)
            .post(`${baseUrl}/past-question/${courseId}`)
            .set('token', moderatorToken)
            .send({ pastQuestionId })
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.have.property('status').to.equals('Success');
              res.body.data.should.have.property('course');
              res.body.data.course.should.have
                .property('name')
                .to.equals(dbCourse.name);
              res.body.data.course.should.have
                .property('alias')
                .to.equals(dbCourse.alias);
              res.body.data.course.should.have
                .property('categoryId')
                .to.equals(dbCourse.categoryId.toHexString());
              res.body.data.course.should.have
                .property('creatorId')
                .to.equals(dbCourse.creatorId.toHexString());
              res.body.data.course.should.have
                .property('createdAt')
                .to.equals(res.body.data.course.updatedAt);
              done();
            });
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
          .post(`${baseUrl}/past-question/${courseId}`)
          .set('token', adminToken)
          .send({ pastQuestionId })
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not link past question');
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/past-question/${courseId}`)
          .send({ pastQuestionId })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/past-question/${courseId}`)
          .set('token', invalidToken)
          .send({ pastQuestionId })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
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
          .post(`${baseUrl}/past-question/${courseId}`)
          .set('token', staffToken)
          .send({ pastQuestionId })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have
              .property('status')
              .to.equals('401 Unauthorized');
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
          .post(`${baseUrl}/past-question/${courseId}`)
          .set('token', moderatorToken);
      });
      it('should not link past question if past question id is not provided', (done) => {
        request.send({}).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Past question id is required');
          done();
        });
      });
      it('should not link past question if past question id is empty', (done) => {
        request.send({ pastQuestionId: '' }).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Past question id cannot be empty');
          done();
        });
      });
      it('should not link past question if past question id is not a string', (done) => {
        request.send({ pastQuestionId: 2 }).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('status')
            .to.equals('400 Invalid Request');
          res.body.should.have
            .property('error')
            .to.equals('Request contains invalid data');
          res.body.should.have
            .property('errors')
            .to.include('Past question id must be a string');
          done();
        });
      });
      it('should not link past question if past question id is not a valid mongoose id', (done) => {
        request
          .send({ pastQuestionId: 'invalidmongooseid' })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have
              .property('status')
              .to.equals('400 Invalid Request');
            res.body.should.have
              .property('error')
              .to.equals('Request contains invalid data');
            res.body.should.have
              .property('errors')
              .to.include('Past question id is not a valid mongoose ID');
            done();
          });
      });
    });

    describe('PAST QUESTION LINK INEXISTENT', () => {
      beforeEach((done) => {
        RelatedPastQuestions.create(
          { courseId, pastQuestionTypeId: pastQuestionId },
          (err) => {
            if (!err) done();
          },
        );
      });
      afterEach((done) => {
        RelatedPastQuestions.deleteMany((err) => {
          if (!err) done();
        });
      });
      it("should not link past question to course if it's already linked", (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/past-question/${courseId}`)
          .set('token', moderatorToken)
          .send({ courseId, pastQuestionId })
          .end((err, res) => {
            res.status.should.equals(409);
            res.body.should.have
              .property('status')
              .to.equals('409 Conflicting Request');
            res.body.should.have
              .property('error')
              .to.equals('Related past question already exists');
            done();
          });
      });
    });
  });
});
