module.exports = (Sequelize, DataTypes) => {
    const jobSkills = Sequelize.define("jobSkills", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        skill: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })

    return jobSkills;
}