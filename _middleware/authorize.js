const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');
const { USERS } = require('../models/user/user.module');
const { ROLES } = require('../models/auth/roles.model');
const { ROLE } = require('../models/auth/role.model');
const { getUserRole } = require('../_helpers/utils');

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
            
            // get user role
           const userRole = await getUserRole(req.user.id);
           //get user
           const account = await USERS.findOne({attributes:['ID'], where: {ID: req.user.id}});
            // if account not exist or role not exists or role is not the correct throw error
            if (!account || !userRole || (roles.length && !roles.includes(userRole))) {
                // account no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
           // req.user.role = account.role;
           // req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}