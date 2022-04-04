module.exports = (Sequelize, DataTypes) => {
    const talentProfile = Sequelize.define("talentProfile", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        talent_logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        talent_website_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        talent_facebook_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        talent_twitter_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        talent_linkedin_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        talent_bio: {
            type: DataTypes.TEXT,
            allowNull: false,
        }, 
    })

    talentProfile.associate = (models) => {
        talentProfile.hasMany(models.talentSkills, {
            onDelete: "cascade",
        });

        talentProfile.hasMany(models.talentProjects, {
            onDelete: "cascade",
        });
    }

    return talentProfile;
}