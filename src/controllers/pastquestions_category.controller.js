import mongoose from 'mongoose';
import Response from '../utils/response.utils';
import PQCategory from '../db/models/pastQuestionTypes.model';

/**
 * This class creates the past questions category controller
 */
export default class PastQuestionsCategoryController {
  /**
     * Retrieves one past question category
     * @param {Object} req
     * @param {Object} res
     * @param {Callback} next
     * @returns {JSON} past question category
     */
  static async getOneCategory(req, res, next) {
    const pqCategoryId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(pqCategoryId)) return Response.BadRequestError(res, 'CategoryId is invalid');
    try {
      const pqCategory = await PQCategory.findById(pqCategoryId);
      return pqCategory
        ? Response.Success(res, pqCategory)
        : Response.NotFoundError(res, 'past questions category not found');
    } catch (error) { next(error); }
  }

  /**
   * @param {object} req The category details
   * @param {object} res The category details returned after listing a category
   * @returns {object} A newly created category
   */
  static async addCategory(req, res) {
    try {
      const pqCategory = await PQCategory.create(
        {
          name: req.body.name,
          categoryId: req.body.categoryId,
        },
      );
      return Response.Success(res, pqCategory, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not add category');
    }
  }

  /**
 * Handles updte of past question category
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async updateCategory(req, res) {
    const pqCategoryId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(pqCategoryId)) return Response.BadRequestError(res, 'CategoryId is invalid');
    try {
      const pqCategory = await PQCategory.findOne({ _id: pqCategoryId });
      if (!pqCategory) return Response.NotFoundError(res, 'category does not exist');
      const categoryValues = { $set: req.body };
      await PQCategory.updateOne({ _id: pqCategoryId }, categoryValues);
      return Response.Success(res, { message: 'category updated successfully' }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not update category');
    }
  }

  /**
 * Handles deletion of past question category
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async deleteCategory(req, res) {
    const pqCategoryId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(pqCategoryId)) return Response.BadRequestError(res, 'CategoryId is invalid');
    try {
      const pqCategory = await PQCategory.findOne({ _id: pqCategoryId });
      if (!pqCategory) { return Response.NotFoundError(res, 'category does not exist'); }
      await PQCategory.deleteOne({ _id: pqCategoryId });
      return Response.Success(res, {
        message: 'past question category deleted successfully',
      }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not delete category');
    }
  }

  /**
   * @param {object} req
   * @param {object} res The past questions ctegory being returned
   * @returns {object} All the past question categories
   */
  static async getAllCategories(req, res) {
    try {
      const pqCategories = await PQCategory.find({});
      if (pqCategories.length < 1) { return Response.NotFoundError(res, 'No past question category has been added'); }
      return Response.Success(res, pqCategories, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not return past question categories.');
    }
  }
}
