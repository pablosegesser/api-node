const { DataTypes } = require("sequelize");
const { sequelize } = require("../../_helpers/db_oracle");



const SHOP = sequelize.define('shop', {
    ADDRESS:{
      type: DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    AVG_REVIEWS:{
      type: DataTypes.FLOAT,
      allowNull:true,
      primaryKey:false},
    BUSINESS_NAME:{
      type: DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    CAP_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    CATEGORY_ID:{
      type: DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    CITY_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    CREATED_AT:{
      type: DataTypes.DATE,
      allowNull:true,
      primaryKey:false},
    DESCRIPTION_LONG:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    DESCRIPTION_SHORT:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    EMAIL:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    FACEBOOK:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    GEO_LAT:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    GEO_LONG:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    ID:{
      type:DataTypes.NUMBER,
      allowNull:false,
      primaryKey:true},
    IMAGE:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    INSTAGRAM:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    KIND:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    MERCHANT_BS_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    MERCHANT_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    NAME:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    NET_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    OPEN_HOUR:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    POINTS_CHARGED:{
      type:DataTypes.FLOAT,
      allowNull:true,
      primaryKey:false},
    POINTS_USED:{
      type:DataTypes.FLOAT,
      allowNull:true,
      primaryKey:false},
    PROVINCE_ID:{
      type:DataTypes.NUMBER,
      allowNull:true,
      primaryKey:false},
    SUBCATEGORY_ID:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    TELEPHONE:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false},
    WEBSITE:{
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false
    },
    },{
      tableName: 'SHOP',
      timestamps: false
    });


    module.exports.SHOP = SHOP;