import CourseCategories from "../db/models/courseCategories.model";
import Response from "../utils/response.utils";

/**
 * Course Category controller class
 * @class CourseCategoriesController
 */
export default class CourseCategoriesController {
  /**
   * Creates course category on the database
   * @param {*} req Request
   * @param {*} res Response object
   * @returns {JSON} Created course category if successful
   * @returns {JSON} Error message if unsuccessful
   */
  static async createCourseCategory(req, res) {
    try {
      const courseCategory = await CourseCategories.create(req.body);

      Response.Success(res, { courseCategory }, 201);
    } catch (err) {
      Response.InternalServerError(res, "Error creating course category");
    }
  }

  /**
   * Edits a course category on the database
   * @param {*} req Request
   * @param {*} res Response object
   * @returns {JSON} Edited course category if successful
   * @returns {JSON} Error message if unsuccessful
   */
  static async deleteCourseCategory(req, res) {
    try {
      await CourseCategories.deleteOne({ _id: req.params.courseCategoryId });

      Response.Success(res, {
        message: "Course category deleted successfully",
      });
    } catch (err) {
      Response.InternalServerError(res, "Error deleting course category");
    }
  }

  /**
   * Edits a course category on the database
   * @param {*} req Request
   * @param {*} res Response object
   * @returns {JSON} Edited course category if successful
   * @returns {JSON} Error message if unsuccessful
   */
  static async editCourseCategory(req, res) {
    try {
      const { dbResult } = req;
      dbResult.set(req.body);
      const courseCategory = await dbResult.save();

      Response.Success(res, { courseCategory });
    } catch (err) {
      Response.InternalServerError(res, "Error editing course category");
    }
  }

  /**
   * Fetches all course categories from the database
   * @param {*} req Request
   * @param {*} res Response object
   * @returns {JSON} All course categories if successful
   * @returns {JSON} Error message if unsuccessful
   */
  static async fetchCourseCategories(req, res) {
    try {
      const courseCategories = await CourseCategories.find();

      Response.Success(res, { courseCategories });
    } catch (err) {
      Response.InternalServerError(res, "Error fetching course categories");
    }
  }
}
