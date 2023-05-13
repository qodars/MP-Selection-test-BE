const { DataTypes } = require('sequelize');
const { sequelize } = require('.');

const User =(sequelize) =>{
    return sequelize.define("user",{
        user_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullname:{
            type: DataTypes.STRING
        },
        bio:{
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        picture:{
            type: DataTypes.STRING
        },
        password:{
            type: DataTypes.STRING
        },
        status:{
            type: DataTypes.STRING,
            defaultValue: "unverify"
        }
    }, {
        tableName: 'user'
    })
}

module.exports = User