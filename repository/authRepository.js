const UserModel = require('../models/User');

const User = {
  findByEmail: async (email) => {
    return await UserModel.findOne({ email });
  },

  create: async (userData) => {
    const newUser = new UserModel(userData);
    return await newUser.save();
  },
};

module.exports = User;
