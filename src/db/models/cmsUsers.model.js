import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: mongoose.Schema.ObjectId,
      ref: 'cmsRoles',
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true },
);
UserSchema.virtual('recentActivities', {
  ref: 'recentActivity',
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
});

const User = mongoose.model('cmsUser', UserSchema);

export default User;