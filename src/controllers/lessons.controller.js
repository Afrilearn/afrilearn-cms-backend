import Response from '../utils/response.utils';
import Lesson from '../db/models/lessons.model';
import Question from '../db/models/questions.model';
import FileHelper from '../utils/upload.utils';

/**
 * This class creates the lesson controller
 */
export default class LessonController {
  /**
 * Handles fetching of lessons
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async fetchAllLessons(req, res) {
    try {
      const result = await Lesson.find();

      return Response.Success(res, { lessons: result });
    } catch (err) {
      Response.InternalServerError(res, 'Error fetching lessons');
    }
  }

  /**
 * Handles lesson creation
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async createLesson(req, res) {
    try {
      const uploads = [];
      req.files.forEach((file) => {
        uploads.push(FileHelper.uploadFile(file));
      });
      const uploadedVideos = await Promise.all(uploads);
      const transcripts = JSON.parse(req.body.transcripts);

      const videoUrls = uploadedVideos.map((video, index) => ({
        videoUrl: video.Location,
        transcript: transcripts[index],
      }));

      const result = await Lesson.create({ ...req.body, videoUrls });

      return Response.Success(res, { lesson: result }, 201);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not create lesson');
    }
  }

  /**
 * Handles lesson editing
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async updateLesson(req, res) {
    const lessonId = req.params.id;
    try {
      const lesson = await Lesson.findOne({ _id: lessonId });
      if (!lesson) return Response.NotFoundError(res, 'Lesson does not exist');
      if (req.files) {
        const uploads = [];
        req.files.forEach((file) => {
          uploads.push(FileHelper.uploadFile(file));
        });
        const uploadedVideos = await Promise.all(uploads);
        const transcripts = JSON.parse(req.body.transcripts);

        const videoUrls = uploadedVideos.map((video, index) => ({
          videoUrl: video.Location,
          transcript: transcripts[index],
        }));
        req.body.videoUrls = videoUrls;
      }

      const lessonValues = { $set: req.body };
      const lessonUpdate = await Lesson.findOneAndUpdate(
        { _id: lessonId }, lessonValues, { returnOriginal: false },
      );
      return Response.Success(res, { lesson: lessonUpdate }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not update lesson');
    }
  }

  /**
 * Handles deletion of lessons
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async deleteLesson(req, res) {
    const lessonId = req.params.id;
    try {
      const lesson = await Lesson.findOne({ _id: lessonId });
      if (!lesson) { return Response.NotFoundError(res, 'lesson not found'); }
      await Lesson.deleteOne({ _id: lessonId });
      return Response.Success(res, {
        message: `${lesson.title} lesson deleted successfully`,
      }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not delete lesson');
    }
  }

  /**
   * View lesson quiz questions
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */
  static async viewLessonQuiz(req, res) {
    try {
      const quiz = await Question.find({ lessonId: req.params.lessonId });
      return Response.Success(res, { questions: quiz });
    } catch (error) {
      return Response.InternalServerError('Error fetching questions');
    }
  }

  /**
   * Add questions to a lesson
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */
  static async createQuiz(req, res) {
    try {
      const images_uploads = [];
      req.files.forEach((file) => {
        images_uploads.push(FileHelper.uploadFile(file));
      });
      const uploadedImages = await Promise.all(images_uploads);
      const imageArrays = [];
      const size = 5;

      while (uploadedImages.length) {
        imageArrays.push(uploadedImages.splice(0, size));
      }

      req.body.questionsArray = JSON.parse(req.body.questionsArray);
      for (let i = 0; i < imageArrays.length; i++) {
        req.body.questionsArray[i].question_image = imageArrays[i][0].Location;
        req.body.questionsArray[i].images = [imageArrays[i][1].Location, imageArrays[i][2].Location,
        imageArrays[i][3].Location, imageArrays[i][4].Location];
      }

      const result = await Question.create({ ...req.body });
      return Response.Success(res, { questions: result }, 201);
    } catch (error) {
      return Response.InternalServerError(res, 'could not add quiz');
    }
  }

  /**
   * Remove question from a lesson
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */
  static async removeQuiz(req, res) {
    try {
      const { questionId } = req.params;
      const question = await Question.findOne({ 'questionsArray._id': questionId });
      if (!question) return Response.NotFoundError(res, 'Question does not exist');
      await Question.updateOne(
        { 'questionsArray._id': questionId }, { $pull: { questionsArray: { _id: questionId } } },
      );
      return Response.Success(res, { message: 'question removed successfully' });
    } catch (error) {
      return Response.InternalServerError(res, 'error removing question');
    }
  }

  /**
   * Update question
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof LessonController
   * @returns {JSON} - A JSON success response.
   */
  static async modifyQuiz(req, res) {
    const { lessonId } = req.params;
    const lesson = await Question.findOne({ lessonId });
    if (!lesson) return Response.NotFoundError(res, 'Lesson quiz does not exist');
    try {
      if (req.files) {
        const images_uploads = [];
        req.files.forEach((file) => {
          images_uploads.push(FileHelper.uploadFile(file));
        });
        const uploadedImages = await Promise.all(images_uploads);
        const imageArrays = [];
        const size = 5;

        while (uploadedImages.length) {
          imageArrays.push(uploadedImages.splice(0, size));
        }

        req.body.questionsArray = JSON.parse(req.body.questionsArray);
        for (let i = 0; i < imageArrays.length; i++) {
          req.body.questionsArray[i].question_image = imageArrays[i][0].Location;
          req.body.questionsArray[i].images = [imageArrays[i][1].Location,
          imageArrays[i][2].Location, imageArrays[i][3].Location,
          imageArrays[i][4].Location];
        }
      }

      const quizValues = { $set: req.body };
      const quizUpdate = await Question.findOneAndUpdate(
        { lessonId }, quizValues, { returnOriginal: false },
      );
      return Response.Success(res, { question: quizUpdate }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not update question');
    }
  }
}
