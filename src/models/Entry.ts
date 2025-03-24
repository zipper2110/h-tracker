import mongoose, { Schema, Document } from 'mongoose';

export interface LevelData {
  value: number;
  label: string;
}

export interface IEntry extends Document {
  date: Date;
  mood: LevelData;
  activity: LevelData;
  sweetFood: LevelData;
  createdAt: Date;
  updatedAt: Date;
}

const EntrySchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  mood: {
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 8
    },
    label: {
      type: String,
      required: true
    }
  },
  activity: {
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    label: {
      type: String,
      required: true
    }
  },
  sweetFood: {
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    label: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Ensure one entry per day
EntrySchema.index({ date: 1 }, { unique: true });

export default mongoose.models.Entry || mongoose.model<IEntry>('Entry', EntrySchema); 