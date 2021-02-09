import mongoose from 'mongoose';

/**
 * Contains General Utils
 *
 * @class GeneralUtils
 */
export default class GeneralUtils {
  /**
   * @param {*} fieldName - name of validated id
   * @returns {true} if id is valid mongoose id
   * @throws {Error} throws invalid mongoose ID error
   */
  static validateMongooseId(fieldName) {
    return (val) => {
      if (mongoose.Types.ObjectId.isValid(val)) return true;
      throw new Error(`${fieldName} is not a valid mongoose ID`);
    };
  }
}
