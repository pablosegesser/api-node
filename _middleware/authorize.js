const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');
const { USERS } = require('../models/user/user.module');
const { ROLES } = require('../models/auth/roles.model');
const { ROLE } = require('../models/auth/role.model');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
           // console.log(`req user: ${JSON.stringify(req.user)}`)
            const account = await USERS.findOne({attributes:['ID'], where: {ID: req.user.id}});
          //  console.log(account)
          if(account){
            console.log('account finded!')
          }
           // const refreshTokens = await db.RefreshToken.find({ account: account. });
           const roleId = await ROLES.findOne({ attributes: ['ROLES_ID'], raw:true, where:{USER_ID: req.user.id}});
         //  console.log('role id '+roleId) 
           const roleName = await ROLE.findOne({ attributes: ["NAME"], raw:true, where: { ID: roleId.ROLES_ID}});
           // console.log(roleName.NAME)
            if (!account || (roles.length && !roles.includes(roleName.NAME))) {
                // account no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            req.user.role = account.role;
           // req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}