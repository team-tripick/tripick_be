const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    planId: {
      type: Number,
      ref: 'Plan',
      required: true,
    },
    logId: {
      type: Number,
      unique: true,
      required: true,
    },
    title: { type: String, required: true },
    log: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
