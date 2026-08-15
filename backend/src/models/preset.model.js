import mongoose from 'mongoose';

const presetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    widthMm: { type: Number, required: true },
    heightMm: { type: Number, required: true },
    dpi: { type: Number, default: 300 },
    bgColor: { type: String, default: '#FFFFFF' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    description: String,
    countries: [String],
  },
  { timestamps: true }
);

presetSchema.index({ active: 1, order: 1 });
presetSchema.index({ name: 1 }, { unique: true });

const Preset = mongoose.model('Preset', presetSchema);

export default Preset;
