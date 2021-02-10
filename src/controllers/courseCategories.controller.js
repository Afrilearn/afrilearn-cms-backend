import CourseCategories from "../db/models/courseCategories.model";
import Response from "../utils/response.utils";

export default class CourseCategoriesController {
  static async createCourseCategory(req, res) {
    try {
      let courseCategory = await CourseCategories.create(req.body);

      Response.Success(res, { courseCategory }, 201);
    } catch (err) {
      Response.InternalServerError(res, "Error creating course category");
    }
  }
}
