"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin.dumbmerch@mail.com",
          password:
            "$2b$10$7ovHDrtaMe.FmutXxEhnWOo7rDOdTloUMgqms5RXYmL5/4dfM.OTm", //123456
          name: "admin",
          status: "admin",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
