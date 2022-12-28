const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');
const { USERS } = require('../models/user/user.module');
const { sequelize } = require('../_helpers/db_oracle');
const { getAllwithPagination, getUserRole } = require('../_helpers/utils');
const { QueryTypes } = require('sequelize');



module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getMovementsPerUser
};

async function authenticate({ username, password, ipAddress }) {
  
  const accountMIA = await USERS.findOne({ raw:true, where: { USERNAME: username }, offset: false, limit: false});

 // with verification
   {/* if (!account || !account.isVerified || !bcrypt.compareSync(password, account.passwordHash)) {
        throw 'Email or password is incorrect';
    }*/}
  
    if (!accountMIA || !bcrypt.compareSync(password, accountMIA.PASSWORD)) {
        throw 'Email or password is incorrect';
    }
    console.log(accountMIA.ID)
    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(accountMIA);
  //  const refreshToken = generateRefreshToken(accountMIA.ID, ipAddress);

    // save refresh token
  //  await refreshToken.save();


    // return basic details and tokens
    return {
        ...basicDetailsMIA(accountMIA),
        jwtToken,
        refreshToken: refreshToken.token,
    };
}


async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { account } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function register(params, origin) {
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    // create account object
    const account = new db.Account(params);

    // first registered account is an admin
    const isFirstAccount = (await db.Account.countDocuments({})) === 0;
    account.role = isFirstAccount ? Role.Admin : Role.User;
    account.verificationToken = randomTokenString();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    // send email
  //  await sendVerificationEmail(account, origin);
}

async function verifyEmail({ token }) {
    const account = await db.Account.findOne({ verificationToken: token });

    if (!account) throw 'Verification failed';

    account.verified = Date.now();
    account.verificationToken = undefined;
    await account.save();
}

async function forgotPassword({ email }, origin) {
    const account = await db.Account.findOne({ email });

    // always return ok response to prevent email enumeration
    if (!account) return;

    // create reset token that expires after 24 hours
    account.resetToken = {
        token: randomTokenString(),
        expires: new Date(Date.now() + 24*60*60*1000)
    };
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const account = await db.Account.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';
}

async function resetPassword({ token, password }) {
    const account = await db.Account.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';

    // update password and remove reset token
    account.passwordHash = hash(password);
    account.passwordReset = Date.now();
    account.resetToken = undefined;
    await account.save();
}

async function getAll(page, size) {
    const resp = await getAllwithPagination({ 
    attributes :'"ID", "FIRST_NAME", "LAST_NAME", "USERNAME", "STATUS", "EMAIL"', 
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

async function create(params) {
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    return basicDetails(account);
}

async function update(id, params) {
    const account = await getAccount(id);

    // validate (if email was changed)
    if (params.email && account.email !== params.email && await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = hash(params.password);
    }

    // copy params to account and save
    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function _delete(id) {
    const account = await getAccount(id);
    await account.remove();
}

// helper functions

async function getAccount(id) {
   // if (!db.isValidId(id)) throw 'Account not found';
    const account = await sequelize.query( `SELECT * FROM "USER_PROFILE" WHERE "USER_PROFILE"."ID" = ${id}`);
    if (!account[0][0]) throw 'Account not found';
        const roleUser = await getUserRole(id);
        let finalAccount = account[0][0];
        if(roleUser){
            finalAccount = {
                ...finalAccount,
                ROLE: roleUser
            }
        }
    return finalAccount;
}

async function getMovementsPerUser(userid, page, size, date_to, date_from, kind_id){
    // validate if userid exists in our database
    const account = await sequelize.query( `SELECT "ID" FROM "USER_PROFILE" WHERE "USER_PROFILE"."ID" = ${userid}`);
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

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('account');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.ID, id: account.ID }, config.secret, { expiresIn: '1h' });
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        account: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function generateTokenMIA(account, ipAddress, token, refreshToken) {
    // save MIA token on database
    return new db.TokenMIA({
        account: account.id,
        token: token,
        refreshToken: refreshToken,
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {
    const { id, title, firstName, lastName, email,genero, role, created, updated,dateOfBirth, isVerified } = account;
    return { id, title, firstName, lastName, email,genero, role, created,dateOfBirth, updated, isVerified };
}

function basicDetailsMIA(account) {
    const { ID, USERNAME, FIRST_NAME, LAST_NAME, BIRTH_DATE, EMAIL, STATUS, ROLE  } = account;
    return  { ID, USERNAME, FIRST_NAME, LAST_NAME, BIRTH_DATE, EMAIL, STATUS, ROLE  };
}

async function sendVerificationEmail(account, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/verify-email?token=${account.verificationToken}`;
        message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Sign-up Verification API - Verify Email',
        html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: 'Sign-up Verification API - Email Already Registered',
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
    });
}

async function sendPasswordResetEmail(account, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/reset-password?token=${account.resetToken.token}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken.token}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Sign-up Verification API - Reset Password',
        html: `<h4>Reset Password Email</h4>
               ${message}`
    });
}