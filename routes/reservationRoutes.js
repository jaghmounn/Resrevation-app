const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const { isLoggedIn } = require('../middlewares/authMiddleware');


router.get('/', isLoggedIn ,  reservationController.listByUser);
router.post('/', isLoggedIn , reservationController.create);
router.put('/:id', reservationController.update);
router.delete('/:id', reservationController.cancel);

router.get("/add/:idSalle" , reservationController.afficheFormAdd) 
module.exports = router;
