
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'token',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      tokenValue: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'token'
    }
  );
  
  Token.associate = (models) => {
    Token.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Token;
};
