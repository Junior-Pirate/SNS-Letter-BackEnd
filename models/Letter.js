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
