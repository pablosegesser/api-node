const { DataTypes } = require("sequelize");
const { sequelize } = require("../../_helpers/db_oracle");



const ROLE = sequelize.define('ROLE', {
    ID:{
      type:DataTypes.NUMBER,
      allowNull:false,
      primaryKey:true,
    },
    NAME:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false
    },
    },{
      tableName: 'ROLE',
      timestamps: false
    });


    module.exports.ROLE = ROLE;