'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize){
    await queryInterface.createTable('token', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'user', // 외래키 참조할 테이블 이름
          key: 'id',     // 참조할 테이블의 칼럼명
        },
      },
      tokenValue: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize){
    await queryInterface.dropTable('token');
  },
};