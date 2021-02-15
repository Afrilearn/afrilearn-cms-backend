import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';

import app from '../index';
import userUtils from '../utils/user.utils';
import MainSubjects from '../db/models/mainSubjects.model';
import Courses from '../db/models/courses.model';
import AfrilearnUsers from '../db/models/users.model';
import Questions from '../db/models/questions.model';
import EnrolledCourses from '../db/models/enrolledCourses.model';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const courses = () => {
  const courses = [];
  for (let i = 1; i < 15; i += 1) {
    courses.push(
      (async () => {
        await Courses.create({
          name: `Course${i}`,
          alias: `alias${i}`,
        });
      })(),
    );
  }
  return courses;
};
const users = () => {
  const users = [];
  let user;
  for (let i = 1; i <= 20; i += 1) {
    if (i % 5 === 0) {
      user = {
        fullName: `User${i}`,
        email: `user@gmail.com${i}`,
        role: '6014126a3636dc4398df7cc4',
      };
    } else if (i % 3 === 0) {
      user = {
        fullName: `User${i}`,
        email: `user2@gmail.com${i}`,
        role: '5fc8cc978e28fa50986ecac9',
      };
    } else {
      user = {
        fullName: `User${i}`,
        email: `user3@gmail.com${i}`,
        role: '5fd08fba50964811309722d5',
      };
    }
    users.push(
      (async () => {
        await AfrilearnUsers.create(user);
      })(),
    );
  }
  return users;
};
const subjects = () => {
  const subjects = [];
  let subject;
  for (let i = 1; i <= 12; i += 1) {
    subject = {
      name: `Subject${i}`,
    };
    subjects.push(
      (async () => {
        await MainSubjects.create(subject);
      })(),
    );
  }
  return subjects;
};
const enrolledCourses = () => {
  const enrollments = [];
  let enrollment;
  for (let i = 1; i <= 15; i += 1) {
    if (i % 3 === 0) {
      enrollment = {
        startDate: new Date(Date.now() - 604800000),
        endDate: new Date(Date.now() - 1),
      };
    } else {
      enrollment = {
        startDate: new Date(Date.now() - 604800000),
        endDate: new Date(Date.now() + 604800000),
      };
    }
    enrollments.push(
      (async () => {
        await EnrolledCourses.create(enrollment);
      })(),
    );
  }

  return enrollments;
};
const quizzes = () => {
  const lessonId = mongoose.Types.ObjectId();
  const quizzes = [];
  for (let i = 1; i <= 20; i += 1) {
    quizzes.push(
      (async () => {
        await Questions.create({
          question: `what is your name?${i}`,
          options: ['1', '2', '3', '4'],
          lessonId,
        });
      })(),
    );
  }
  return quizzes;
};
const invalidToken = 'invalid.jwt.token';
const staffToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209ab2792e63fc841de3c',
  'Staff User',
);
// const moderatorToken = userUtils.generateToken(
//   mongoose.Types.ObjectId(),
//   "602209c32792e63fc841de3d",
//   "Moderator User"
// );
const adminToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209d72792e63fc841de3e',
  'Administrator User',
);

const baseUrl = '/api/v1/counts';

describe('COUNTS', () => {
  describe('/GET api/v1/counts', () => {
    describe('FETCH COUNTS SUCCESSFULLY', () => {
      before(async () => {
        await Promise.all([
          AfrilearnUsers.deleteMany(),
          Courses.deleteMany(),
          MainSubjects.deleteMany(),
          EnrolledCourses.deleteMany(),
          Questions.deleteMany(),
        ]).then(async () => {
          await Promise.all([
            ...users(),
            ...courses(),
            ...subjects(),
            ...enrolledCourses(),
            ...quizzes(),
          ]);
        });
      });
      after(async () => {
        await Promise.all([
          AfrilearnUsers.deleteMany(),
          Courses.deleteMany(),
          MainSubjects.deleteMany(),
          EnrolledCourses.deleteMany(),
          Questions.deleteMany(),
        ]);
      });

      it('should fetch all counts successfully for all users', (done) => {
        chai
          .request(app)
          .get(baseUrl)
          .set('token', staffToken)
          .end((err, res) => {
            res.status.should.equals(200);
            res.body.data.should.have.property('counts');
            res.body.data.counts.courses.should.equals(14);
            res.body.data.counts.subjects.should.equals(12);
            res.body.data.counts.quizzes.should.equals(20);
            res.body.data.counts.subscribedUsers.should.equals(10);
            res.body.data.counts.unsubscribedUsers.should.equals(5);
            res.body.data.counts.afrilearnUsers.students.should.equals(11);
            res.body.data.counts.afrilearnUsers.teachers.should.equals(5);
            res.body.data.counts.afrilearnUsers.admins.should.equals(4);
            done();
          });
      });
    });

    describe('FAKE INTERNAL SERVER ERROR', () => {
      let stub;
      before(() => {
        stub = sinon.stub(Courses, 'countDocuments').throws(new Error('error'));
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
              .to.equals('Error fetching database counts');
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
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
});
