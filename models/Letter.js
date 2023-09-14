module.exports = (sequelize, DataTypes) => {
    const Letter = sequelize.define(
        "letter",
        {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            nickname: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            deadline: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                defaultValue: 0, 
                validate: {
                    min: 0, 
                    max: 6, 
                    isInt: true,
                },
            },
        },
        {
            timestamps: false,
            tableName: 'letter'
        }
    );

    Letter.associate = (models) => {
        Letter.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Letter;
}
