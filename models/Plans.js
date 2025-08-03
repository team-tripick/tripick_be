const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    place: { type: String, required: true },
    plan: { type: String, required: true },
    keyword: { type: Object, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    planId : {type: Number, required: true, unique: true,}
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
