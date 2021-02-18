import mongoose from 'mongoose';

const EnrolledCourseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
    status: {
      type: String,
      default: 'trial',
    },
    classId: {
      type: mongoose.Schema.ObjectId,
      ref: 'class',
    },
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: 'course',
    },
    startDate: {
      type: Date,
      default: new Date(),
    },
    endDate: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

EnrolledCourseSchema.methods.toJSON = function () {
  const enrolledCourse = this;
  const enrolledCourseObject = enrolledCourse.toObject();
  enrolledCourseObject.paymentIsActive = enrolledCourseObject.endDate > Date.now();
  return enrolledCourseObject;
};

EnrolledCourseSchema.virtual('courses', {
  ref: 'course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: false,
});
const EnrolledCourse = mongoose.model('enrolledCourse', EnrolledCourseSchema);
export default EnrolledCourse;
