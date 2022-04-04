module.exports = (Sequelize, DataTypes) => {
    const user  = Sequelize.define("user", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
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
    });

    user.associate = (models) => {
        user.hasOne(models.job, {
            onDelete: "cascade",
        });

        user.hasOne(models.companyProfile, {
            onDelete: "cascade",
        });

        user.hasOne(models.talentProfile, {
            onDelete: "cascade",
        })
    }

    return user;                                   

}