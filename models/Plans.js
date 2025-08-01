const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    plan: { type: String, required: true },
    keyword: { type: Object, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
