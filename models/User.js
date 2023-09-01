
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            startedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            finishedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            }
        },
        {
            timestamps: false,
            tableName: 'user' //설정안하면 테이블의 기본 이름이 users로 바뀜
        }
    );

    User.associate = (models) => {
        User.hasOne(models.Token, { foreignKey: 'userId', as: 'token' });
        User.hasMany(models.Token, { foreignKey: 'userId', as: 'letter' });
    };

    return User;
}