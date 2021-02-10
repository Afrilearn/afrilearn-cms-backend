import GeneralServices from "../services/general.services";
import CourseCategories from "../db/models/courseCategories.model";

export default class CourseCategoryMiddleware {
  static checkCourseCategoryInexistence(req, res, next) {
    GeneralServices.checkDocInexistence(
      res,
      next,
      CourseCategories,
      { name: req.body.name },
      "This course category"
    );
  }
}
