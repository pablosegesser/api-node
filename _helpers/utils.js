const { number } = require("joi");
const { QueryTypes } = require("sequelize");
const { ROLE } = require("../models/auth/role.model");
const { ROLES } = require("../models/auth/roles.model");
const { USERS } = require("../models/user/user.module");
const { sequelize } = require("./db_oracle");





// getModel of table
const getModel = async(tableName)=>{
    const INTERFACE = await sequelize.getQueryInterface() .describeTable(tableName);
    console.log(`${tableName} MODEL: ${JSON.stringify(INTERFACE)}`);
    return INTERFACE;
    }


    // transform object in a formData
const toFormData = (data) => {
    const formData = new FormData();
  
    Object.keys(data).forEach(key => {
      // if is array then we need to loop through the array and add each item to the form data
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => {
          formData.append(`${key}[]`, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
  //  console.log('formdata', formData);
    return formData;
  };


  // make pagination

  const getPagination = (page, size) => {
    const limit = size ? Number(size) * Number(page) : 10;
    const offset = page ? (Number(page) - 1) * Number(size) : 0;
  
    return { limit, offset };
  };


 const getPagingData = (data, page, limit, totalItems) => {
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, data, totalPages, currentPage };
  };


  const getTotalRows = async(tableName, condition) =>{
    const totalItems = await sequelize.query(`SELECT count(*) over() count FROM ${tableName} ${condition ? `WHERE ${condition}` : ''}`, {
       // replacements: {tablename: tableName},
        type: QueryTypes.SELECT,
    });
  //  console.log(`total: ${JSON.stringify(totalItems)}`)
    if(totalItems){
        return totalItems[0].COUNT
    }
    return {
        msg: 'error'
    }
  }

  const getUserRole = async(id) =>{
    const account = await USERS.findOne({attributes:['ID'], where: {ID: id}});
    //  console.log(account)
    if(account){
      console.log('account finded!')
    
     // const refreshTokens = await db.RefreshToken.find({ account: account. });
     const roleId = await ROLES.findOne({ attributes: ['ROLES_ID'], raw:true, where:{USER_ID: id}});
   //  console.log('role id '+roleId) 
     const roleName = await ROLE.findOne({ attributes: ["NAME"], raw:true, where: { ID: roleId.ROLES_ID}});
     return roleName.NAME;
    }
    return false;

  }

  const getAllwithPagination = async({attributes, tableName, orderby, condition, page, size, userRole})=>{
    const { limit, offset } = getPagination(page, size);
    //  const accounts = await USERS.findAndCountAll({ raw: true, attributes: ['ID', 'FIRST_NAME', 'LAST_NAME'], limit: limit, offset: offset, order: [ ['ID', 'DESC']], subQuery: false});
      const account = await sequelize.query(`SELECT ${attributes ? attributes : '*'}
      FROM (
          SELECT ${attributes ? attributes : '*'},
              row_number() over (order by ${orderby ? orderby : '"ID"'}) rowRank
             
          FROM ${tableName} ${condition ? `WHERE ${condition}` : ''}
      )
      WHERE rowRank <= :LIMIT AND rowRank > :OFFSET;` , {
          replacements: {   LIMIT: limit, OFFSET: offset },
          type: QueryTypes.SELECT,
         // raw: true
        });
  
       const totalItems = await getTotalRows(tableName, condition)
      //  console.log(totalItems);
      //  console.log(account);
      const resp = getPagingData(account, page, size, totalItems );

      return resp
  }

  const insertMethod = async({tableName, attributes, values, condition}) =>{
    const [result, metadata] = await sequelize.query(`INSERT INTO ${tableName} (${attributes}) VALUES (${values}) ${condition ? `WHERE ${condition} `: ''}`);
    console.log('result: '+result);
    console.log('metadata: '+metadata)
    return result;
  }

  const updateMethod = async({tableName, attributesWithValues, condition}) =>{
    const [result, metadata] = await sequelize.query(`UPDATE ${tableName} SET ${attributesWithValues} ${condition ? `WHERE ${condition} `: ''}`);
  }

  const deleteMethod = async({tableName, condition}) =>{
    const [result, metadata] = await sequelize.query(`DELETE FROM ${tableName} ${condition ? `WHERE ${condition} `: ''}`);
  }


  module.exports = {
    getModel,
    getPagination,
    getPagingData,
    toFormData,
    getTotalRows,
    getAllwithPagination,
    getUserRole
  }
    
