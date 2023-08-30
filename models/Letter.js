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
            }
        },
        {
            timestamps: true,
            tableName: 'letter'
        }
    );

    Letter.associate = (models) => {
        Letter.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Letter;
}
