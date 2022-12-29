const expressMovement = require('express');
const authorizeMovement = require('../../_middleware/authorize');
const routerMovement = expressMovement.Router();
const movementService = require('./movements.service.ts');

// routes
routerMovement.get('/:id', authorizeMovement(), getMovementsByUserId);


module.exports = routerMovement;


function getMovementsByUserId(req, res, next) {
    const { page, size, date_to, date_from, kind_id } = req.query;
    movementService.getAllMovementsByUser(req.params.id, page, size, date_to, date_from, kind_id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}