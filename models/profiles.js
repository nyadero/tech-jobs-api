module.exports = (Sequelize, DataTypes) => {
    const profiles = Sequelize.define("profiles", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_tagline: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_website_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_facebook_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_twitter_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_linkedin_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        }                         
    });


    return profiles;
}