import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Lesson from '../db/models/lessons.model';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';
import aws from 'aws-sdk';

import app from '../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const validCreatorId = mongoose.Types.ObjectId();
const validSubjectId = mongoose.Types.ObjectId();
const validCourseId = mongoose.Types.ObjectId();
const validTermId = mongoose.Types.ObjectId();
const lesson = {
  title: 'Lesson One',
  creatorId: validCreatorId,
  courseId: validCourseId,
  subjectId: validSubjectId,
  termId: validTermId,
  content: 'Lesson One is important',
};
const lessonUpdate = {
  title: 'Lesson Two',
  courseId: validCourseId,
  subjectId: validSubjectId,
  termId: validTermId,
  content: 'Lesson Two is important',
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

const baseUrl = '/api/v1/lesson';
describe('LESSONS', () => {
  describe(`/POST ${baseUrl}`, () => {
    describe('SUCCESSFUL LESSON CREATION', () => {
      let uploadedFile;
      beforeEach(async () => {
        await Lesson.deleteMany();
      });
      afterEach(async () => {
        await Lesson.deleteMany();
        const s3 = new aws.S3();
        aws.config.setPromisesDependency();
        aws.config.update({
          secretAccessKey: 'XOBy5yocMWuLgbhOYJCGr7QmNmm0NJGb/16CiEuR',
          accessKeyId: 'AKIAISRPVTHSMOK2AFCQ',
          region: 'us-east-1',
        });
        const params = {
          Bucket: 'afrilearn',
          Key: `${uploadedFile}`,
        };

        await s3.deleteObject(params).promise();
      });
      it('should create lesson if request is valid and user is admin', (done) => {
         const videos = {
          path: './src/test/videos/fileOne.mp4'
        }
        chai
          .request(app)
          .post(`${baseUrl}`)
          .set('token', adminToken)
          .field('title', JSON.stringify(lesson.title))
          .field('creatorId', lesson.creatorId)
          .field('courseId', lesson.courseId)
          .field('subjectId', lesson.subjectId)
          .field('termId', lesson.termId)
          .field('content', JSON.stringify(lesson.content))
          .attach('videoUrls', videos.path)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').to.equals('error');
            console.log(res.body.errors)
            res.body.data.should.have.property('lesson');
            res.body.data.lesson.should.have
              .property('title')
              .to.equals(lesson.title);
            res.body.data.lesson.should.have.property('createdAt');
            res.body.data.lesson.should.have.property('updatedAt');
            const file = res.body.data.lesson.videoUrls[0].videoUrl;
            uploadedFile = file.slice(file.lastIndexOf('/') + 1);
            done();
          });
      });
      it('should create lesson if request is valid and user is moderator', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}`)
          .set('token', adminToken)
          .send(lesson)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('lesson');
            res.body.data.lesson.should.have
              .property('title')
              .to.equals(lesson.title);
            res.body.data.lesson.should.have.property('createdAt');
            res.body.data.lesson.should.have.property('updatedAt');
            done();
          });
      });
    });
    it('should create lesson if request is valid and user is staff', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}`)
        .set('token', staffToken)
        .send(lesson)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('status').to.equals('success');
          res.body.data.should.have.property('lesson');
          res.body.data.lesson.should.have
            .property('title')
            .to.equals(lesson.title);
          res.body.data.lesson.should.have.property('createdAt');
          res.body.data.lesson.should.have.property('updatedAt');
          done();
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
          .post(`${baseUrl}`)
          .set('token', adminToken)
          .send(lesson)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not create lesson');
            done();
          });
      });
    });
    // describe('TOKEN VALIDATION', () => {
    //   it('should return 401 with error message if no token is provided', (done) => {
    //     chai
    //       .request(app)
    //       .post(`${baseUrl}`)
    //       .send(lesson)
    //       .end((err, res) => {
    //         res.should.have.status(401);
    //         res.body.should.have.property('status').to.equals('error');
    //         res.body.should.have
    //           .property('error')
    //           .to.equals('Not authorized to access data');
    //         done();
    //       });
    //   });
    //   it('should return 401 status with error message if an invalid token is provided', (done) => {
    //     chai
    //       .request(app)
    //       .post(`${baseUrl}`)
    //       .set('token', invalidToken)
    //       .send(lesson)
    //       .end((err, res) => {
    //         res.should.have.status(401);
    //         res.body.should.have.property('status').to.equals('error');
    //         res.body.should.have
    //           .property('error')
    //           .to.equals('Not authorized to access data');
    //         done();
    //       });
    //   });
    // });

    // describe('INPUT VALIDATION', () => {
    //   let request;
    //   let dynamicLesson;
    //   beforeEach(() => {
    //     request = chai.request(app).post(`${baseUrl}`).set('token', adminToken);
    //     dynamicLesson = {
    //       tiltle: 'Test Lesson',
    //     };
    //   });

    //   it('should not create lesson if lesson VideoUrls is not an array', (done) => {
    //     dynamicLesson.videoUrls = 'vidoe@url.com';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have.property('errors').to.include('VideoUrls must be an array');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if lesson title is not provided', (done) => {
    //     delete dynamicLesson.title;
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have.property('errors').to.include('Title is required');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if lesson title is empty', (done) => {
    //     dynamicLesson.title = '';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Title cannot be empty');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if lesson title is not string', (done) => {
    //     dynamicLesson.title = 2;
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Title must be a string');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if content is not string', (done) => {
    //     dynamicLesson.content = 2;
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Content must be a string');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if courseId is empty', (done) => {
    //     dynamicLesson.courseId = '';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Course Id cannot be empty');
    //       done();
    //     });
    //   });

    //   it('should not create lesson if creatorId is not provided', (done) => {
    //     delete dynamicLesson.creatorId;
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Creator Id is required');
    //       done();
    //     });
    //   });

    //   it('should not create lesson if creatorId is empty', (done) => {
    //     dynamicLesson.creatorId = '';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Creator Id cannot be empty');
    //       done();
    //     });
    //   });

    //   it('should not create lesson if creatorId is not a valid mongoose id', (done) => {
    //     dynamicLesson.creatorId = 'invalidmongooseid';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Creator id is not a valid mongoose ID');
    //       done();
    //     });
    //   });

    //   it('should not create lesson if termId is empty', (done) => {
    //     dynamicLesson.termId = '';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Term Id cannot be empty');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if subjectId is empty', (done) => {
    //     dynamicLesson.subjectId = '';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Subject Id cannot be empty');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if courseId is not a valid mongoose id', (done) => {
    //     dynamicLesson.courseId = 'invalidmongooseid';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Course id is not a valid mongoose ID');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if subjectId is not a valid mongoose id', (done) => {
    //     dynamicLesson.subjectId = 'invalidmongooseid';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Subject id is not a valid mongoose ID');
    //       done();
    //     });
    //   });
    //   it('should not create lesson if termId is not a valid mongoose id', (done) => {
    //     dynamicLesson.termId = 'invalidmongooseid';
    //     request.send(dynamicLesson).end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.have.property('status').to.equals('error');
    //       res.body.should.have
    //         .property('errors')
    //         .to.include('Term id is not a valid mongoose ID');
    //       done();
    //     });
    //   });
    // });
  });

  // describe(`/GET ${baseUrl}`, () => {
  //   describe('Successful fetch', () => {
  //     before(async () => {
  //       await Lesson.deleteMany();
  //       const lessons = [];
  //       for (let i = 1; i < 4; i += 1) {
  //         lessons.push(
  //           (async () => {
  //             await Lesson.create({ ...lesson, title: `LessonTest${i}` });
  //           })(),
  //         );
  //       }
  //       await Promise.all(lessons);
  //     });
  //     after((done) => {
  //       Lesson.deleteMany((err) => {
  //         if (!err) done();
  //       });
  //     });
  //     it('should fetch all lessons for an admin', (done) => {
  //       chai
  //         .request(app)
  //         .get(baseUrl)
  //         .set('token', adminToken)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.data.should.have.property('lessons');
  //           res.body.data.lessons.length.should.equals(3);
  //           const titles = res.body.data.lessons.map((lesson) => lesson.title);
  //           for (let i = 1; i < 4; i += 1) {
  //             titles.should.include(`LessonTest${i}`);
  //           }
  //           done();
  //         });
  //     });
  //     it('should fetch all lessons for a moderator', (done) => {
  //       chai
  //         .request(app)
  //         .get(baseUrl)
  //         .set('token', moderatorToken)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.data.should.have.property('lessons');
  //           res.body.data.lessons.length.should.equals(3);
  //           const titles = res.body.data.lessons.map((lesson) => lesson.title);
  //           for (let i = 1; i < 4; i += 1) {
  //             titles.should.include(`LessonTest${i}`);
  //           }
  //           done();
  //         });
  //     });
  //     it('should fetch all lessons for a staff', (done) => {
  //       chai
  //         .request(app)
  //         .get(baseUrl)
  //         .set('token', staffToken)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.data.should.have.property('lessons');
  //           res.body.data.lessons.length.should.equals(3);
  //           const titles = res.body.data.lessons.map((lesson) => lesson.title);
  //           for (let i = 1; i < 4; i += 1) {
  //             titles.should.include(`LessonTest${i}`);
  //           }
  //           done();
  //         });
  //     });
  //   });

  //   describe('FAKE INTERNAL SERVER ERROR', () => {
  //     let stub;
  //     before(() => {
  //       stub = sinon.stub(Response, 'Success').throws(new Error('error'));
  //     });
  //     after(() => {
  //       stub.restore();
  //     });
  //     it('returns status of 500', (done) => {
  //       chai
  //         .request(app)
  //         .get(baseUrl)
  //         .set('token', adminToken)
  //         .send(lesson)
  //         .end((err, res) => {
  //           res.should.have.status(500);
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Error fetching lessons');
  //           done();
  //         });
  //     });
  //   });

  //   describe('TOKEN VALIDATION', () => {
  //     it('should return 401 with error message if no token is provided', (done) => {
  //       chai
  //         .request(app)
  //         .get(baseUrl)
  //         .end((err, res) => {
  //           res.should.have.status(401);
  //           res.body.should.have.property('status').to.equals('error');
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Not authorized to access data');
  //           done();
  //         });
  //     });
  //     it('should return 401 status with error message if an invalid token is provided', (done) => {
  //       chai
  //         .request(app)
  //         .get(baseUrl)
  //         .set('token', invalidToken)
  //         .send(lesson)
  //         .end((err, res) => {
  //           res.should.have.status(401);
  //           res.body.should.have.property('status').to.equals('error');
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Not authorized to access data');
  //           done();
  //         });
  //     });
  //   });
  // });

  // describe(`/PUT ${baseUrl}/:id`, () => {
  //   let lessonId;
  //   beforeEach(async () => {
  //     await Lesson.deleteMany();
  //     const createdLesson = await Lesson.create(lesson);
  //     lessonId = createdLesson._id;
  //   });
  //   afterEach((done) => {
  //     Lesson.deleteMany((err) => {
  //       if (!err) done();
  //     });
  //   });
  //   describe('SUCCESS', () => {
  //     beforeEach(async () => {
  //       await Lesson.deleteMany();
  //       const createdLesson = await Lesson.create(lesson);
  //       lessonId = createdLesson._id;
  //     });
  //     afterEach((done) => {
  //       Lesson.deleteMany((err) => {
  //         if (!err) done();
  //       });
  //     });

  //     it('should edit lesson if request is valid and user is admin', (done) => {
  //       chai
  //         .request(app)
  //         .put(`${baseUrl}/${lessonId}`)
  //         .set('token', adminToken)
  //         .send(lessonUpdate)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.data.should.have.property('lesson');
  //           res.body.data.lesson.should.have
  //             .property('title')
  //             .to.equals(lessonUpdate.title);
  //           done();
  //         });
  //     });
  //     it('should edit lesson if request is valid and user is moderator', (done) => {
  //       chai
  //         .request(app)
  //         .put(`${baseUrl}/${lessonId}`)
  //         .set('token', moderatorToken)
  //         .send(lessonUpdate)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.data.should.have.property('lesson');
  //           res.body.data.lesson.should.have
  //             .property('title')
  //             .to.equals(lessonUpdate.title);
  //           done();
  //         });
  //     });
  //     it('should edit lesson if request is valid and user is staff', (done) => {
  //       chai
  //         .request(app)
  //         .put(`${baseUrl}/${lessonId}`)
  //         .set('token', staffToken)
  //         .send(lessonUpdate)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.data.should.have.property('lesson');
  //           res.body.data.lesson.should.have
  //             .property('title')
  //             .to.equals(lessonUpdate.title);
  //           done();
  //         });
  //     });
  //   });

  //   describe('FAKE INTERNAL SERVER ERROR', () => {
  //     let stub;
  //     before(() => {
  //       stub = sinon.stub(Response, 'Success').throws(new Error('error'));
  //     });
  //     after(() => {
  //       stub.restore();
  //     });
  //     it('returns status of 500', (done) => {
  //       chai
  //         .request(app)
  //         .put(`${baseUrl}/${lessonId}`)
  //         .set('token', adminToken)
  //         .send(lessonUpdate)
  //         .end((err, res) => {
  //           res.should.have.status(500);
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Could not update lesson');
  //           done();
  //         });
  //     });
  //   });

  //   describe('TOKEN VALIDATION', () => {
  //     it('should return 401 with error message if no token is provided', (done) => {
  //       chai
  //         .request(app)
  //         .put(`${baseUrl}/${lessonId}`)
  //         .send(lessonUpdate)
  //         .end((err, res) => {
  //           res.should.have.status(401);
  //           res.body.should.have.property('status').to.equals('error');
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Not authorized to access data');
  //           done();
  //         });
  //     });
  //     it('should return 401 status with error message if an invalid token is provided', (done) => {
  //       chai
  //         .request(app)
  //         .put(`${baseUrl}/${lessonId}`)
  //         .set('token', invalidToken)
  //         .send(lessonUpdate)
  //         .end((err, res) => {
  //           res.should.have.status(401);
  //           res.body.should.have.property('status').to.equals('error');
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Not authorized to access data');
  //           done();
  //         });
  //     });
  //   });

  //   describe('INPUT VALIDATION', () => {
  //     let dynamicLesson;
  //     let request;
  //     beforeEach(() => {
  //       dynamicLesson = {};
  //       request = chai
  //         .request(app)
  //         .put(`${baseUrl}/${lessonId}`)
  //         .set('token', adminToken);
  //     });
  //     it('should not edit lesson if lesson title is empty', (done) => {
  //       dynamicLesson.title = '';
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Title cannot be empty');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if lesson title is not string', (done) => {
  //       dynamicLesson.title = 2;
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Title must be a string');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if content is not string', (done) => {
  //       dynamicLesson.content = 2;
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Content must be a string');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if courseId is empty', (done) => {
  //       dynamicLesson.courseId = '';
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Course Id cannot be empty');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if termId is empty', (done) => {
  //       dynamicLesson.termId = '';
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Term Id cannot be empty');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if subjectId is empty', (done) => {
  //       dynamicLesson.subjectId = '';
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Subject Id cannot be empty');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if courseId is not a valid mongoose id', (done) => {
  //       dynamicLesson.courseId = 'invalidmongooseid';
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Course id is not a valid mongoose ID');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if subjectId is not a valid mongoose id', (done) => {
  //       dynamicLesson.subjectId = 'invalidmongooseid';
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Subject id is not a valid mongoose ID');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if termId is not a valid mongoose id', (done) => {
  //       dynamicLesson.termId = 'invalidmongooseid';
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Term id is not a valid mongoose ID');
  //         done();
  //       });
  //     });
  //     it('should not edit lesson if creatorId is provided', (done) => {
  //       dynamicLesson.creatorId = '';
  //       request.send(dynamicLesson).end((err, res) => {
  //         res.should.have.status(400);
  //         res.body.should.have.property('status').to.equals('error');
  //         res.body.should.have
  //           .property('errors')
  //           .to.include('Cannot change lesson creator');
  //         done();
  //       });
  //     });
  //   });

  //   describe('Lesson EXISTENCE', () => {
  //     beforeEach((done) => {
  //       Lesson.deleteMany((err) => {
  //         if (!err) done();
  //       });
  //     });
  //     it('should send back 404 status with error if Lesson does not exist', (done) => {
  //       chai
  //         .request(app)
  //         .put(`${baseUrl}/${lessonId}`)
  //         .set('token', adminToken)
  //         .end((err, res) => {
  //           res.status.should.equals(404);
  //           res.body.should.have.property('status').to.equals('error');
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Lesson does not exist');
  //           done();
  //         });
  //     });
  //   });
  // });

  // describe(`/DELETE ${baseUrl}/:id`, () => {
  //   let lessonId;
  //   beforeEach(async () => {
  //     await Lesson.deleteMany();
  //     const createdLesson = await Lesson.create(lesson);
  //     lessonId = createdLesson._id;
  //   });
  //   afterEach((done) => {
  //     Lesson.deleteMany((err) => {
  //       if (!err) done();
  //     });
  //   });
  //   describe('SUCCESSFUL DELETE', () => {
  //     beforeEach(async () => {
  //       await Lesson.deleteMany();
  //       const createdLesson = await Lesson.create(lesson);
  //       lessonId = createdLesson._id;
  //     });
  //     afterEach((done) => {
  //       Lesson.deleteMany((err) => {
  //         if (!err) done();
  //       });
  //     });
  //     it('should delete lesson if data is valid and user is admin', (done) => {
  //       chai
  //         .request(app)
  //         .delete(`${baseUrl}/${lessonId}`)
  //         .set('token', adminToken)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.should.have.property('data');
  //           res.body.data.should.have
  //             .property('message')
  //             .to.equals(`${lesson.title} lesson deleted successfully`);
  //           done();
  //         });
  //     });
  //     it('should delete lesson if data is valid and user is moderator', (done) => {
  //       chai
  //         .request(app)
  //         .delete(`${baseUrl}/${lessonId}`)
  //         .set('token', moderatorToken)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.should.have.property('data');
  //           res.body.data.should.have
  //             .property('message')
  //             .to.equals(`${lesson.title} lesson deleted successfully`);
  //           done();
  //         });
  //     });
  //     it('should delete lesson if data is valid and user is a staff', (done) => {
  //       chai
  //         .request(app)
  //         .delete(`${baseUrl}/${lessonId}`)
  //         .set('token', staffToken)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property('status').to.equals('success');
  //           res.body.should.have.property('data');
  //           res.body.data.should.have
  //             .property('message')
  //             .to.equals(`${lesson.title} lesson deleted successfully`);
  //           done();
  //         });
  //     });
  //   });
  //   describe('FAKE INTERNAL SERVER ERROR', () => {
  //     let stub;
  //     before(() => {
  //       stub = sinon.stub(Response, 'Success').throws(new Error('error'));
  //     });
  //     after(() => {
  //       stub.restore();
  //     });
  //     it('returns status of 500', (done) => {
  //       chai
  //         .request(app)
  //         .delete(`${baseUrl}/${lessonId}`)
  //         .set('token', adminToken)
  //         .end((err, res) => {
  //           res.should.have.status(500);
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Could not delete lesson');
  //           done();
  //         });
  //     });
  //   });
  //   describe('TOKEN VALIDATION', () => {
  //     it('should return 401 with error message if no token is provided', (done) => {
  //       chai
  //         .request(app)
  //         .delete(`${baseUrl}/${lessonId}`)
  //         .end((err, res) => {
  //           res.should.have.status(401);
  //           res.body.should.have.property('status').to.equals('error');
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Not authorized to access data');
  //           done();
  //         });
  //     });
  //     it('should return 401 status with error message if an invalid token is provided', (done) => {
  //       chai
  //         .request(app)
  //         .delete(`${baseUrl}/${lessonId}`)
  //         .set('token', invalidToken)
  //         .end((err, res) => {
  //           res.should.have.status(401);
  //           res.body.should.have.property('status').to.equals('error');
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('Not authorized to access data');
  //           done();
  //         });
  //     });
  //   });

  //   describe('Lesson EXISTENCE', () => {
  //     beforeEach((done) => {
  //       Lesson.deleteMany((err) => {
  //         if (!err) done();
  //       });
  //     });
  //     it('should send back 404 status with error if Lesson does not exist', (done) => {
  //       chai
  //         .request(app)
  //         .delete(`${baseUrl}/${lessonId}`)
  //         .set('token', adminToken)
  //         .end((err, res) => {
  //           res.status.should.equals(404);
  //           res.body.should.have.property('status').to.equals('error');
  //           res.body.should.have
  //             .property('error')
  //             .to.equals('lesson not found');
  //           done();
  //         });
  //     });
  //   });
  // });
});