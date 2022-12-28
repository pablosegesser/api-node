const { DataTypes } = require("sequelize");
const { sequelize } = require("../../_helpers/db_oracle");



const USERS = sequelize.define('USER_PROFILE', {
    AVATAR_PHOTO:{
      type:DataTypes.BLOB,
      allowNull:true,
      primaryKey:false},
    BEST_CUSTOMER_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    BIRTH_DATE:{
      type:DataTypes.DATE,
      allowNull:true,
      primaryKey:false},
    CAP_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    CARD:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    CATEGORY_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    COUNTRY_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    CREATED_AT:{
      type:DataTypes.DATE,
      allowNull:true,
      primaryKey:false},
    EMAIL:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    EMAIL_BS:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    EMAIL_DATETIME:{
      type:DataTypes.DATE,
      allowNull:true,
      primaryKey:false},
    EMAIL_OLD:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    ENABLED_EMAIL:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    FIRST_NAME:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    FNET_CUSTOMER_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    FRIEND_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    GENDER:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    ID:{
      type:DataTypes.NUMBER,
      allowNull:false,
      primaryKey:true},
    LAST_NAME:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    ONESIGNAL_ID:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    PASSWORD:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    PRIVACY_ANALYSIS_DATA:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    PRIVACY_MKT:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    PRIVACY_THIRD_PARTNER:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    PROVINCE_CODE:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    STATUS:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    UPDATED_AT:{
      type:DataTypes.DATE,
      allowNull:true,
      primaryKey:false},
    USERNAME:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    USER_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    VERIFICATION_CODE:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false}
  },
  {
    tableName: 'USER_PROFILE',
    timestamps: false
  });

  module.exports.USERS = USERS;