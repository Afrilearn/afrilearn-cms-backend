import mongoose from 'mongoose';

/**
 * Contains General Utils
 *
 * @class GeneralUtils
 */
export default class GeneralUtils {
  /**
     * @returns {true} if id is valid mongoose id
     * @throws {Error} throws invalid mongoose ID error
     */
  static validateMongooseId() {
    return (val) => {
      if (mongoose.Types.ObjectId.isValid(val)) return true;
      throw new Error('Invalid mongoose ID');
    };
  }
}
