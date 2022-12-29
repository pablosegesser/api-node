const { sequelizeMovements } = require('../../_helpers/db_oracle');
const { getAllwithPagination : getAllMovments} = require('../../_helpers/utils');




module.exports = {
    getAllMovementsByUser
};



async function getAllMovementsByUser(userid, page, size, date_to, date_from, kind_id){
    // validate if userid exists in our database
    const account = await sequelizeMovements.query( `SELECT "ID" FROM "USER_PROFILE" WHERE "USER_PROFILE"."ID" = ${userid}`);
    //if not exists response with error
    if(!account[0][0]) throw 'Account not found with that id: '+userid;
    //set date to
    const dateTo = date_to ? date_to : '01/01/2023 12:00:00';
    // set date from
    const dateFrom = date_from ? date_from : '01/01/2018 12:00:00';
    //set kind id
    const kindId = kind_id ? kind_id : 6;
    // build a condition
    const condition = `"MIA_MOVEMENT"."USER_ID" = ${userid} AND "MIA_MOVEMENT"."DATE_MOVEMENT" BETWEEN to_date( '${dateFrom}','DD/MM/YYYY hh:mi:ss') and  to_date('${dateTo}','DD/MM/YYYY hh:mi:ss') AND "MIA_MOVEMENT"."KIND_ID" = ${kindId}`;
    // set attributes
    const attributes = ['"ID", "STATUS", "TOTAL_AMOUNT", "DATE_MOVEMENT", "CASHBACK_CHARGED", "CASHBACK_PENDING", "KIND_ID"'];
    // make thr response
    const finalResp = await getAllwithPagination({tableName: '"MIA_MOVEMENT"', attributes , page, size, condition:condition });

    return finalResp;

}