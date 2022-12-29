const express1 = require('express');
const router = express1.Router();
const authorize = require('_middleware/authorize')
const usersService = require('./users.service.ts');

// routes
router.get('/', authorize(), getAllUsers);
router.get('/:id', authorize(), getUserById);

module.exports = router;



function getAllUsers(req, res, next) {
    const { page, size } = req.query;
    usersService.getAll(page, size)
        .then(accounts => res.json(accounts))
        .catch(next);
}

function getUserById(req, res, next) {
    // users can get their own account and admins can get any account
    {/*if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }*/}
    if (req.params.id === req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    usersService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

