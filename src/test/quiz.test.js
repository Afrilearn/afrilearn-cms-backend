// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import Sinonchai from 'sinon-chai';
// import sinon from 'sinon';
// import mongoose from 'mongoose';
// import Courses from '../db/models/courses.model';
// import userUtils from '../utils/user.utils';
// import Response from '../utils/response.utils';

// import app from '../index';
// import RelatedPastQuestions from '../db/models/relatedPastQuestions.model';
// import Subjects from '../db/models/subjects.model';
// import MainSubjects from '../db/models/mainSubjects.model';
// import PastQuestionTypes from '../db/models/pastQuestionTypes.model';

// chai.should();
// chai.use(Sinonchai);
// chai.use(chaiHttp);

// const validCreatorId = mongoose.Types.ObjectId();
// const validLessonId = mongoose.Types.ObjectId();
// const question = {
//   question: 'What is your name?',
//   options: ['Mark', 'George', 'Victor', 'Why do you ask?'],
//   creatorId: validCreatorId,
//   lessonId: validLessonId,
//   correctOption: 3
// };
// const questionUpdate = {
//     question: 'What is your name?',
//     options: ['Mark', 'George', 'Victor', 'Why do you ask?'],
//     correctOption: 3
// };
// const invalidToken = 'invalid.jwt.token';
// const staffToken = userUtils.generateToken(
//   mongoose.Types.ObjectId(),
//   '602209ab2792e63fc841de3c',
//   'Staff User',
// );
// const moderatorToken = userUtils.generateToken(
//   mongoose.Types.ObjectId(),
//   '602209c32792e63fc841de3d',
//   'Moderator User',
// );
// const adminToken = userUtils.generateToken(
//   mongoose.Types.ObjectId(),
//   '602209d72792e63fc841de3e',
//   'Administrator User',
// );

// const baseUrl = '/api/v1/courses';

// describe("QUIZ", () => {
//     describe("SUCCESSFUL QUIZ CREATION", () => {

//     })
// })
