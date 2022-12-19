const express = require('express');
const router = express.Router();
const campeonatoService = require('./campeonato.service');


// routes
router.post('/add-new', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);


module.exports = router;


function register(req, res, next) {
campeonatoService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}


function getAll(req, res, next) {
    campeonatoService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    campeonatoService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    campeonatoService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    campeonatoService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    campeonatoService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}