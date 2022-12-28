const express = require('express');
const authorize = require('../../_middleware/authorize');
const router = express.Router();
const movementService = require('./movements.service');

// routes
router.get('/:id', authorize(), getMovementsByUserId);


module.exports = router;


function getMovementsByUserId(req, res, next){
    const {page,size, date_to, date_from, kind_id} = req.query;
    movementService.getMovementsPerUser(req.params.id,page, size, date_to, date_from, kind_id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}