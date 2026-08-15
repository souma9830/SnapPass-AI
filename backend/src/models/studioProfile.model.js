import mongoose from 'mongoose';

const studioProfileSchema = new mongoose.Schema(
  {
    studioId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: 'default_studio',
    },
    studioName: {
      type: String,
      required: true,
      default: 'SnapPass Partner Studio',
    },
    ownerName: {
      type: String,
      default: 'Studio Manager',
    },
    currencySymbol: {
      type: String,
      default: '$',
    },
    defaultPaperCostPerSheet: {
      type: Number,
      default: 0.35,
      min: 0,
    },
    customerPricePerSheet: {
      type: Number,
      default: 12.0,
      min: 0,
    },
    subscriptionTier: {
      type: String,
      enum: ['starter', 'pro', 'enterprise'],
      default: 'pro',
    },
  },
  { timestamps: true }
);

const StudioProfile = mongoose.model('StudioProfile', studioProfileSchema);
export default StudioProfile;
