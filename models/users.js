module.exports = (Sequelize, DataTypes) => {
    const users  = Sequelize.define("users", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reset_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        token_expiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    users.associate = (models) => {
        users.hasOne(models.jobs, {
            onDelete: "cascade",
        });

        users.hasOne(models.profiles, {
            onDelete: "cascade",
        });
    }

    return users;                                   

}