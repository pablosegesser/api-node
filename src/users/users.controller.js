const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize')
const usersService = require('./users.service');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);

module.exports = router;



function getAll(req, res, next) {
    const { page, size } = req.query;
    usersService.getAll(page, size)
        .then(accounts => res.json(accounts))
        .catch(next);
}

function getById(req, res, next) {
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

