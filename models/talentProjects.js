module.exports = (Sequelize, DataTypes) => {
    const talentProjects = Sequelize.define("talentProjects", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        project_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        project_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        project_url:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    })

    talentProjects.associate = (models) => {
        talentProjects.hasMany(models.likes, {
            onDelete: "cascade",
        });

        talentProjects.hasMany(models.comments, {
            onDelete: "cascade",
        });
    }

    return talentProjects;
}