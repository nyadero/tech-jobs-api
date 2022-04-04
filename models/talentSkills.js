module.exports = (Sequelize, DataTypes) => {
    const talentSkills = Sequelize.define("talentSkills", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        skill: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    return talentSkills;
}