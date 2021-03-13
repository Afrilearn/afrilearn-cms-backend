import mongoose from "mongoose";
import aws from "aws-sdk";
import fs from "fs";
import Response from "../utils/response.utils";
import MajorSubject from "../db/models/mainSubjects.model";

/**
 * This class creates the major subject controller
 */
export default class MajorSubjectController {
  /**
   * @param {object} req The main subject details
   * @param {object} res The main subject details returned after listing a main subject
   * @returns {object} A newly created Main Subject
   */
  static async addMajorSubject(req, res) {
    try {
      const s3 = new aws.S3();
      aws.config.setPromisesDependency();
      aws.config.update({
        secretAccessKey: process.env.S3_ACCESS_SECRET,
        accessKeyId: process.env.S3_ACCESS_KEY,
        region: "us-east-1",
      });

      const params = {
        ACL: "public-read",
        Bucket: "afrilearn",
        Body: fs.createReadStream(req.file.path),
        Metadata: { fieldName: req.file.fieldname },
        Key: `subject-images/${Date.now() + req.file.originalname}`,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          throw err;
        }
        fs.unlinkSync(req.file.path);

        /**
         * Adds subject to database
         */
        async function create() {
          const subject = await MajorSubject.create({
            name: req.body.name,
            imageUrl: data.Location,
            introText: req.body.introText,
            classification: req.body.classification,
          });
          return Response.Success(res, { subject }, 201);
        }
        create();
      });
    } catch (error) {
      fs.unlinkSync(req.file.path);
      return Response.InternalServerError(res, "Could not add subject");
    }
  }

  /**
   * Handles fetching of major subjects
   * @param {ServerRequest} req
   * @param {ServerResponse} res
   * @returns {ServerResponse} response
   */
  static async fetchAllSubjects(req, res) {
    try {
      const result = await MajorSubject.find();

      return Response.Success(res, { subjects: result });
    } catch (err) {
      Response.InternalServerError(res, "Error fetching subjects");
    }
  }

  /**
   * Handles major subject editing
   * @param {ServerRequest} req
   * @param {ServerResponse} res
   * @returns {ServerResponse} response
   */
  static async updateMajorSubject(req, res) {
    const mainSubjectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(mainSubjectId)) {
      return Response.BadRequestError(res, "mainSubjectId is invalid");
    }
    try {
      const mainSubject = await MajorSubject.findOne({ _id: mainSubjectId });
      if (!mainSubject)
        return Response.NotFoundError(res, "subject does not exist");
      const subjectValues = { $set: req.body };
      await MajorSubject.updateOne({ _id: mainSubjectId }, subjectValues);
      return Response.Success(
        res,
        { message: "subject updated successfully" },
        200
      );
    } catch (error) {
      return Response.InternalServerError(res, "Could not update subject");
    }
  }

  /**
   * Handles deletion of major subjects
   * @param {ServerRequest} req
   * @param {ServerResponse} res
   * @returns {ServerResponse} response
   */
  static async deleteMajorSubject(req, res) {
    const mainSubjectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(mainSubjectId))
      return Response.BadRequestError(res, "mainSubjectId is invalid");
    try {
      const subject = await MajorSubject.findOne({ _id: mainSubjectId });
      if (!subject) {
        return Response.NotFoundError(res, "major subject does not exist");
      }
      await MajorSubject.deleteOne({ _id: mainSubjectId });
      return Response.Success(
        res,
        {
          message: `${subject.name} subject deleted successfully`,
        },
        200
      );
    } catch (error) {
      return Response.InternalServerError(res, "Could not delete subject");
    }
  }
}
