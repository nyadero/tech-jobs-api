module.exports = (Sequelize, DataTypes) => {
    const comments = Sequelize.define("comments",  {
        uuid : {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        commentor_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        commentor_avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        comment_body: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    return comments;
}