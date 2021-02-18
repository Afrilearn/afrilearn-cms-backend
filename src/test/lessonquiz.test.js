import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Lesson from '../db/models/lessons.model';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';

import app from '../index';
import Question from '../db/models/questions.model';

const aws = require('aws-sdk');
const s3 = new aws.S3();

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const validLessonId = mongoose.Types.ObjectId();
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

const question = {
  lessonId: validLessonId.toHexString(),
  creator_Id: validCreatorId.toHexString(),
  questionsArray:
        [{
          question: 'What is your name?',
          options: ['Taye', 'Taiwo', 'ELizabeth'],
          correct_option: '1',
          explanation: 'random explanation',
        }],
};
const questionUpdate = {
  options: ['Taye', 'Taiwo', 'ELizabeth'],
  correct_option: '2',
  explanation: 'another random explanation',
};
const images = [
  { path: './src/test/images/cooker1.jpg' },
  { path: './src/test/images/cooker2.jpg' },
  { path: './src/test/images/cooker3.jpg' },
  { path: './src/test/images/cooker4.jpg' },
  { path: './src/test/images/cooker5.jpg' },
];
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
describe('LESSON QUIZ', () => {
  describe(`/POST ${baseUrl}/quiz`, () => {
    describe('SUCCESSFUL QUIZ CREATION', () => {
      let uploadedFile = [];
      beforeEach(async () => {
        await Question.deleteMany();
      });
      afterEach(async () => {
        await Question.deleteMany();
        const s3 = new aws.S3();
        aws.config.setPromisesDependency();
        aws.config.update({
          secretAccessKey: process.env.S3_ACCESS_SECRET,
          accessKeyId: process.env.S3_ACCESS_KEY,
          region: 'us-east-1',
        });

        const objects = [];
        for (let i = 0; i < 5; i++) {
          objects.push({
            Key: `test/${uploadedFile[i]}`,
          });
        }

        const params = {
          Bucket: 'afrilearn',
          Delete: {
            Objects: objects,
            Quiet: false,
          },
        };
        await s3.deleteObjects(params).promise();
        uploadedFile = [];
      });
      it('should create question if request is valid and user is admin', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/quiz`)
          .set('token', adminToken)
          .set('content-type', 'multipart/form-data')
          .field('lessonId', question.lessonId)
          .field('creator_Id', question.creator_Id)
          .field('questionsArray', JSON.stringify(question.questionsArray))
          .attach('images', images[0].path)
          .attach('images', images[1].path)
          .attach('images', images[2].path)
          .attach('images', images[3].path)
          .attach('images', images[4].path)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('questions');
            res.body.data.questions.should.have
              .property('questionsArray');
            res.body.data.questions.should.have.property('createdAt');
            res.body.data.questions.should.have.property('updatedAt');
            const question_file = res.body.data.questions.questionsArray[0].question_image;
            uploadedFile.push(question_file.slice(question_file.lastIndexOf('/') + 1));
            const options_files = res.body.data.questions.questionsArray[0].images;
            for (let i = 0; i < 4; i++) {
              uploadedFile.push(options_files[i].slice(options_files[i].lastIndexOf('/') + 1));
            }
            done();
          });
      });
      it('should create question if request is valid and user is moderator', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/quiz`)
          .set('token', moderatorToken)
          .set('content-type', 'multipart/form-data')
          .field('lessonId', question.lessonId)
          .field('creator_Id', question.creator_Id)
          .field('questionsArray', JSON.stringify(question.questionsArray))
          .attach('images', images[0].path)
          .attach('images', images[1].path)
          .attach('images', images[2].path)
          .attach('images', images[3].path)
          .attach('images', images[4].path)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('questions');
            res.body.data.questions.should.have
              .property('questionsArray');
            res.body.data.questions.should.have.property('createdAt');
            res.body.data.questions.should.have.property('updatedAt');
            const question_file = res.body.data.questions.questionsArray[0].question_image;
            uploadedFile.push(question_file.slice(question_file.lastIndexOf('/') + 1));
            const options_files = res.body.data.questions.questionsArray[0].images;
            for (let i = 0; i < 4; i++) {
              uploadedFile.push(options_files[i].slice(options_files[i].lastIndexOf('/') + 1));
            }
            done();
          });
      });
      it('should create question if request is valid and user is staff', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/quiz`)
          .set('token', staffToken)
          .set('content-type', 'multipart/form-data')
          .field('lessonId', question.lessonId)
          .field('creator_Id', question.creator_Id)
          .field('questionsArray', JSON.stringify(question.questionsArray))
          .attach('images', images[0].path)
          .attach('images', images[1].path)
          .attach('images', images[2].path)
          .attach('images', images[3].path)
          .attach('images', images[4].path)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('questions');
            res.body.data.questions.should.have
              .property('questionsArray');
            res.body.data.questions.should.have.property('createdAt');
            res.body.data.questions.should.have.property('updatedAt');
            const question_file = res.body.data.questions.questionsArray[0].question_image;
            uploadedFile.push(question_file.slice(question_file.lastIndexOf('/') + 1));
            const options_files = res.body.data.questions.questionsArray[0].images;
            for (let i = 0; i < 4; i++) {
              uploadedFile.push(options_files[i].slice(options_files[i].lastIndexOf('/') + 1));
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
          .post(`${baseUrl}/quiz`)
          .set('token', adminToken)
          .send(question)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('could not add quiz');
            done();
          });
      });
    });
    // describe('FAKE INTERNAL SERVER ERROR', () => {
    //     let stub;

    //     before(() => {
    //         stub = sinon.stub(s3, 'upload').throws(new Error('error'));
    //     });
    //     after(() => {
    //         stub.restore();
    //     });
    //     it('returns status of 500', (done) => {
    //         chai
    //             .request(app)
    //             .post(`${baseUrl}/quiz`)
    //             .set('token', staffToken)
    //             .set('content-type', 'multipart/form-data')
    //             .field('lessonId', question.lessonId)
    //             .field('creator_Id', question.creator_Id)
    //             .field('questionsArray', JSON.stringify(question.questionsArray))
    //             .attach('images', images[0].path)
    //             .end((err, res) => {
    //                 res.should.have.status(500);
    //                 res.body.should.have
    //                     .property('error')
    //                     .to.equals('could not add quiz');
    //                 done();
    //             });
    //     });
    // });
    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .post(`${baseUrl}/quiz`)
          .send(question)
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
          .post(`${baseUrl}/quiz`)
          .set('token', invalidToken)
          .send(question)
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
      let dynamicQuestion;
      beforeEach(() => {
        request = chai.request(app).post(`${baseUrl}/quiz`).set('token', adminToken);
        dynamicQuestion = {
          questionsArray: [{
            question: 'How are you?',
          }],
        };
      });
      it('should not create question if question is not string', (done) => {
        dynamicQuestion.questionsArray[0].question = 2;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Question must be a string');
          done();
        });
      });
      it('should not create question if explanation is empty', (done) => {
        dynamicQuestion.questionsArray[0].explanation = '';
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Explanation cannot be empty');
          done();
        });
      });
      it('should not create question if explanation is not string', (done) => {
        dynamicQuestion.questionsArray[0].explanation = 2;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Explanation must be a string');
          done();
        });
      });
      it('should not create question if lessonId is not provided', (done) => {
        delete dynamicQuestion.question;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Lesson id is required');
          done();
        });
      });
      it('should not create question if lessonId is not a valid mongoose id', (done) => {
        dynamicQuestion.lessonId = 'invalidmongooseid';
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Lesson id is not a valid mongoose ID');
          done();
        });
      });
      it('should not create question if creatorId is not provided', (done) => {
        delete dynamicQuestion.creator_Id;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Creator id is required');
          done();
        });
      });
      it('should not create question if creatorId is not a valid mongoose id', (done) => {
        dynamicQuestion.creator_Id = 'invalidmongooseid';
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Creator id is not a valid mongoose ID');
          done();
        });
      });
      it('should not create quiz if images is not an array', (done) => {
        dynamicQuestion.questionsArray[0].images = 2;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Images must be an array');
          done();
        });
      });
      it('should not create quiz if options are not provided', (done) => {
        delete dynamicQuestion.questionsArray[0].options;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Options are required');
          done();
        });
      });
      it('should not create quiz if options is not an array', (done) => {
        dynamicQuestion.options = 2;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Options must be an array');
          done();
        });
      });
      it('should not create quiz if correct option is not provided', (done) => {
        delete dynamicQuestion.correct_option;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Correct option is required');
          done();
        });
      });
      it('should not create quiz if correct option is not a number', (done) => {
        dynamicQuestion.correct_option = [];
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Correct option must be a number');
          done();
        });
      });
    });
  });

  describe(`/GET ${baseUrl}/:lessonId/quiz`, () => {
    let lessonId;
    beforeEach(async () => {
      await Question.deleteMany();
      await Lesson.deleteMany();
      const createdLesson = await Lesson.create(lesson);
      lessonId = createdLesson._id;
      const questions = [];
      for (let i = 1; i < 4; i += 1) {
        questions.push(
          (async () => {
            await Question.create({ ...question, lessonId, question: `QuizTest${i}` });
          })(),
        );
      }
      await Promise.all(questions);
    });
    afterEach(async () => {
      await Question.deleteMany();
      await Lesson.deleteMany();
    });
    describe('Successful fetch of lesson questions', () => {
      it('should fetch all questions for an admin', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${lessonId}/quiz`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('questions');
            res.body.data.questions.length.should.equals(3);
            done();
          });
      });
      it('should fetch all questions for a moderator', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${lessonId}/quiz`)
          .set('token', moderatorToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('questions');
            res.body.data.questions.length.should.equals(3);
            done();
          });
      });
      it('should fetch all questions for a staff', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${lessonId}/quiz`)
          .set('token', staffToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('questions');
            res.body.data.questions.length.should.equals(3);
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .get(`${baseUrl}/${lessonId}/quiz`)
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
          .get(`${baseUrl}/${lessonId}/quiz`)
          .set('token', invalidToken)
          .send(lesson)
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

    describe('FAKE INTERNAL SERVER ERROR', () => {
      let stub;
      before(() => {
        stub = sinon.stub(Response, 'Success').throws(new Error('error'));
      });
      after(() => {
        stub.restore();
      });
      it('returns status of 500', async () => {
        chai
          .request(app)
          .get(`${baseUrl}/602209ab2792e63fc841de3c/quiz`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Error fetching questions');
          });
      });
    });
  });

  describe(`/PUT ${baseUrl}/lessonId/quiz`, () => {
    let lessonId;
    let uploadedFile = [];
    beforeEach(async () => {
      await Lesson.deleteMany();
      await Question.deleteMany();
      const createdLesson = await Lesson.create(lesson);
      lessonId = createdLesson._id;
      await Question.create({
        lessonId, creator_Id: mongoose.Types.ObjectId(),
      });
    });
    afterEach(async () => {
      await Lesson.deleteMany();
      await Question.deleteMany();
      const s3 = new aws.S3();
      aws.config.setPromisesDependency();
      aws.config.update({
        secretAccessKey: process.env.S3_ACCESS_SECRET,
        accessKeyId: process.env.S3_ACCESS_KEY,
        region: 'us-east-1',
      });

      const objects = [];
      for (let i = 0; i < 5; i++) {
        objects.push({
          Key: `test/${uploadedFile[i]}`,
        });
      }

      const params = {
        Bucket: 'afrilearn',
        Delete: {
          Objects: objects,
          Quiet: false,
        },
      };
      await s3.deleteObjects(params).promise();
      uploadedFile = [];
    });
    describe('SUCCESS', () => {
      it('should edit question if request is valid and user is admin', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${lessonId}/quiz`)
          .set('token', adminToken)
          .set('content-type', 'multipart/form-data')
          .field('lessonId', question.lessonId)
          .field('questionsArray', JSON.stringify(question.questionsArray))
          .attach('images', images[0].path)
          .attach('images', images[1].path)
          .attach('images', images[2].path)
          .attach('images', images[3].path)
          .attach('images', images[4].path)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('question');
            res.body.data.question.should.have
              .property('questionsArray');
            const question_file = res.body.data.question.questionsArray[0].question_image;
            uploadedFile.push(question_file.slice(question_file.lastIndexOf('/') + 1));
            const options_files = res.body.data.question.questionsArray[0].images;
            for (let i = 0; i < 4; i++) {
              uploadedFile.push(options_files[i].slice(options_files[i].lastIndexOf('/') + 1));
            }
            done();
          });
      });
      it('should edit question if request is valid and user is moderator', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${lessonId}/quiz`)
          .set('token', adminToken)
          .send(questionUpdate)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('question');
            res.body.data.question.should.have
              .property('questionsArray');
            done();
          });
      });
      it('should edit question if request is valid and user is staff', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${lessonId}/quiz`)
          .set('token', adminToken)
          .send(questionUpdate)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('question');
            res.body.data.question.should.have
              .property('questionsArray');
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
          .put(`${baseUrl}/${lessonId}/quiz`)
          .set('token', adminToken)
          .send(questionUpdate)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not update question');
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${lessonId}/quiz`)
          .send(questionUpdate)
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
          .put(`${baseUrl}/${lessonId}/quiz`)
          .set('token', invalidToken)
          .send(questionUpdate)
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
      let dynamicQuestion;
      let request;
      beforeEach(() => {
        dynamicQuestion = {
          questionsArray: [{
            question: 'How are you?',
          }],
        };
        request = chai
          .request(app)
          .put(`${baseUrl}/${lessonId}/quiz`)
          .set('token', adminToken);
      });
      it('should not edit quiz if explanation is empty', (done) => {
        dynamicQuestion.questionsArray[0].explanation = '';
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Explanation cannot be empty');
          done();
        });
      });
      it('should not edit quiz if quiz explanation is not string', (done) => {
        dynamicQuestion.questionsArray[0].explanation = 2;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Explanation must be a string');
          done();
        });
      });
      it('should not edit quiz if question is not string', (done) => {
        dynamicQuestion.questionsArray[0].question = 2;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Question must be a string');
          done();
        });
      });
      it('should not edit quiz if images is not an array', (done) => {
        dynamicQuestion.questionsArray[0].images = 2;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Images must be an array');
          done();
        });
      });
      it('should not edit quiz if options is not an array', (done) => {
        dynamicQuestion.questionsArray[0].options = 2;
        request.send(dynamicQuestion).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Options must be an array');
          done();
        });
      });
    });

    describe('QUESTION EXISTENCE', () => {
      beforeEach((done) => {
        Question.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should send back 404 status with error if question does not exist', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${lessonId}/quiz`)
          .set('token', adminToken)
          .end((err, res) => {
            res.status.should.equals(404);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Lesson quiz does not exist');
            done();
          });
      });
    });
  });

  describe(`/DELETE ${baseUrl}/quiz/:questionId`, () => {
    let questionId;
    beforeEach(async () => {
      await Question.deleteMany();
      const createdQuiz = await Question.create(question);
      questionId = createdQuiz.questionsArray[0]._id;
    });
    afterEach((done) => {
      Question.deleteMany((err) => {
        if (!err) done();
      });
    });
    describe('SUCCESSFUL DELETE', () => {
      let questionId;
      beforeEach(async () => {
        await Question.deleteMany();
        const createdQuiz = await Question.create(question);
        questionId = createdQuiz.questionsArray[0]._id;
      });
      afterEach((done) => {
        Question.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should delete question if data is valid and user is admin', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/quiz/${questionId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.should.have.property('data');
            res.body.data.should.have
              .property('message')
              .to.equals('question removed successfully');
            done();
          });
      });
      it('should delete question if data is valid and user is moderator', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/quiz/${questionId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.should.have.property('data');
            res.body.data.should.have
              .property('message')
              .to.equals('question removed successfully');
            done();
          });
      });
      it('should delete question if data is valid and user is a staff', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/quiz/${questionId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.should.have.property('data');
            res.body.data.should.have
              .property('message')
              .to.equals('question removed successfully');
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
          .delete(`${baseUrl}/quiz/${questionId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('error removing question');
            done();
          });
      });
    });
    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/quiz/${questionId}`)
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
          .delete(`${baseUrl}/quiz/${questionId}`)
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

    describe('Question EXISTENCE', () => {
      beforeEach((done) => {
        Question.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should send back 404 status with error if Question does not exist', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/quiz/${questionId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.status.should.equals(404);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Question does not exist');
            done();
          });
      });
    });
  });
});
