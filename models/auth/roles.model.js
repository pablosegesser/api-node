const { DataTypes } = require("sequelize");
const { sequelize } = require("../../_helpers/db_oracle");



const ROLES = sequelize.define('USER_PROFILE_ROLES', {
    USER_ID:{
      type:DataTypes.NUMBER,
      allowNull:false,
      primaryKey:true},
    ROLES_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false
    },
    },{
      tableName: 'USER_PROFILE_ROLES',
      timestamps: false
    });


    module.exports.ROLES = ROLES;