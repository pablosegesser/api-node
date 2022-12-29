const { sequelize } = require('../../_helpers/db_oracle');
const { getAllwithPagination, getUserRole } = require('../../_helpers/utils');



module.exports = {
    getAll,
    getById,
};

async function getAll(page, size) {
    const resp = await getAllwithPagination({
        attributes: '"ID", "FIRST_NAME", "LAST_NAME", "USERNAME", "STATUS", "EMAIL"',
        tableName: "USER_PROFILE",
        page,
        size
    });
    return resp;
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetailsMIA(account);
}

async function getAccount(id) {
    // if (!db.isValidId(id)) throw 'Account not found';
    const account = await sequelize.query(`SELECT * FROM "USER_PROFILE" WHERE "USER_PROFILE"."ID" = ${id}`);
    if (!account[0][0]) throw 'Account not found';
    const roleUser = await getUserRole(id);
    let finalAccount = account[0][0];
    if (roleUser) {
        finalAccount = {
            ...finalAccount,
            ROLE: roleUser
        }
    }
    return finalAccount;
}



function basicDetailsMIA(account) {
    const { ID, USERNAME, FIRST_NAME, LAST_NAME, BIRTH_DATE, EMAIL, STATUS, ROLE } = account;
    return { ID, USERNAME, FIRST_NAME, LAST_NAME, BIRTH_DATE, EMAIL, STATUS, ROLE };
}

