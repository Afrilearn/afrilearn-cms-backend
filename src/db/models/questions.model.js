import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.ObjectId,
      ref: 'lesson',
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
    questionsArray: [
      {
        question: {
          type: String,
        },
        question_image: {
          type: String,
        },
        question_position: {
          type: String,
          default: 'above',
        },
        options: { type: Array },
        images: { type: Array },
        correct_option: {
          type: Number,
          required: true,
        },
        explanation: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Question = mongoose.model('question', QuestionSchema);

export default Question;
