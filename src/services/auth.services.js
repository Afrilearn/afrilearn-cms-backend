// import Auth from '../db/models/users.model';
// import EnrolledCourse from '../db/models/enrolledCourses.model';
// import ResetPassword from '../db/models/resetPassword.model';

export default {
  // async emailExist(email, res) {
  //   try {
  //     const condition = {
  //       email,
  //     };
  //     const user = await Auth.findOne(condition)
  //       .populate({
  //         path: 'enrolledCourses',
  //         model: EnrolledCourse,
  //         populate: {
  //           path: 'courseId',
  //           select: 'name imageUrl',
  //         },
  //       })
  //       .populate({ path: 'classOwnership', populate: 'enrolledCourse' });

  //     return user;
  //   } catch (err) {
  //     return res.status(500).json({
  //       status: '500 Internal server error',
  //       error: 'Error checking for email',
  //     });
  //   }
  // },
};
