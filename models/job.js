module.exports = (Sequelize, DataTypes) => {
    const job = Sequelize.define("job", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        promoter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        application_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_open: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });

    job.associate = (models) => {
        job.hasMany(models.jobSkills, {
            onDelete: "cascade"
        })
    }

    return job;
}