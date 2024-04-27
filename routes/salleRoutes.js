const express = require('express');
const router = express.Router();
const salleController = require('../controllers/salleController');

router.get('/', salleController.getAllSalles);
router.get('/:id', salleController.getSalleById);
router.post('/', salleController.addSalle);
router.put('/:id', salleController.updateSalle);
router.delete('/:id', salleController.deleteSalle);




router.get('/add/form', salleController.afficheForm);
router.get('/update/form/:id', salleController.afficheForm);


module.exports = router;