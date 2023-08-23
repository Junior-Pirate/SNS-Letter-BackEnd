
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
                type: DataTypes.STRING(20),
                allowNull: false,
            }
        },
        {
            timestamps: false,
        }
    );
    return User;
}