module.exports = (Sequelize, DataTypes) => {
    const likes = Sequelize.define("likes", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        like: {
            type: DataTypes.BOOLEAN,
        }
    });

    return likes;
}