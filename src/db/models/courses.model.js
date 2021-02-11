import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    alias: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: 'coursecategory',
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'cmsuser',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true },
);

courseSchema.virtual('relatedPastQuestions', {
  ref: 'RelatedPastQuestion',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false,
});
courseSchema.virtual('relatedSubjects', {
  ref: 'subject',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false,
});

const Course = mongoose.model('course', courseSchema);

export default Course;
