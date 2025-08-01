const UserModel = require('../models/User');

const User = {
  findByEmail: async (email) => {
    return await UserModel.findOne({ where: { email } });
  },

  create: async (userData) => {
    const newUser = await UserModel.create(userData);
    return newUser;
  },
};

module.exports = User;
