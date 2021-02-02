import Auth from '../db/models/users.model';
import Helper from '../utils/user.utils';
import AuthServices from '../services/auth.services';
import ClassModel from '../db/models/classes.model';
import EnrolledCourse from '../db/models/enrolledCourses.model';

/**
 *Contains Auth Controller
 *
 *
 *
 * @class AuthController
 */
class AuthController {
  /**
   * Create account for a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async signUp(req, res) {
    try {
      const {
        fullName, password, email, role,
      } = req.body;

      const encryptpassword = await Helper.encrptPassword(password);

      const newUser = {
        fullName,
        password: encryptpassword,
        email,
        role,
      };

      const result = await Auth.create({ ...newUser });

      const enrolledCourse = await EnrolledCourse.create({
        userId: result._id,
        courseId: req.body.courseId,
      });

      // if role is a teacher && there are className and courseId in body
      // create class with the info
      if (role === '5fc8cc978e28fa50986ecac9') {
        let classCode = await Helper.generateCode(8);
        const existingClassCode = await ClassModel.findOne({ classCode });
        if (existingClassCode) {
          classCode = await Helper.generateCode(8);
        }
        const newClass = await ClassModel.create({
          userId: result._id,
          name: req.body.className,
          courseId: req.body.courseId,
          classCode,
        });

        await enrolledCourse.update({ classId: newClass._id }, { new: true });
        await enrolledCourse.save();
      }

      const user = await AuthServices.emailExist(email, res);
      const token = await Helper.generateToken(result._id, role, fullName);

      // const message = `Please verify your email address to complete your Afrilearn Account.<br/>Click the link https://www.myafrilearn.com/?token=${token}`;

      return res.status(201).json({
        status: 'success',
        data: {
          token,
          user,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error creating new user',
      });
    }
  }

  /**
   * Activate user account.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async activateAccount(req, res) {
    try {
      const { id } = req.data;

      const newData = {
        isActivated: true,
      };

      await Auth.findByIdAndUpdate(id, { ...newData });

      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Account activation successful',
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error activating user account',
      });
    }
  }

  /**
   * Login user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthServices.emailExist(email, res);

      if (!user) {
        return res.status(401).json({
          status: '401 Unauthorized',
          error: 'Invalid email address',
        });
      }

      const confirmPassword = await Helper.verifyPassword(
        password,
        user.password,
      );

      if (!confirmPassword) {
        return res.status(401).json({
          status: '401 Unauthorized',
          error: 'Invalid password',
        });
      }

      const token = await Helper.generateToken(
        user.id,
        user.role,
        user.fullName,
      );

      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error Logging in user',
      });
    }
  }

  /**
   * Change Password.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async changePassword(req, res) {
    try {
      const { email, password } = req.body;
      const encryptpassword = await Helper.encrptPassword(password);
      const newData = {
        password: encryptpassword,
      };
      await Auth.findOneAndUpdate({ email }, { ...newData });

      return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully',
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error changing password',
      });
    }
  }
}
export default AuthController;
