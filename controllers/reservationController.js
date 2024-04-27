const { sendMail } = require("../config/email");
const Reservation = require("../models/Reservation");
const Salle = require("../models/salle");

exports.listByUser = async (req, res) => {
    try {
      const userId = req.user.id; 
      const reservations = await Reservation.find({ userId }).populate('salleId').populate({path:'userId' , select:"nom email"});
      res.render('showReservations', {reservations} )
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
exports.afficheFormAdd  = async (req, res) => {
  try{
    const salle = await Salle.findOne({ _id:req.params.idSalle}) ; 
    console.log(salle) 
     if(!salle) {
      res.redirect("/api/salles")
    }
    else {
      res.render('addReservation' , {salle : salle} ) 
    }
  }catch(error) {
    console.log(error)
    res.redirect("/api/salles")

  }
}
  exports.create = async (req, res) => {
    try {
      console.log(req.body)
      console.log(req.user.id)
      const {  salleId, startTime, endTime } = req.body;

        const userId = req.user.id;
        const salle = await Salle.findById(salleId);
        if (!salle) {
          return res.status(404).json({ message: 'Salle not found' });
        }
        if (startTime >= endTime) {
          return res.status(400).json({ message: 'Start time must be before end time' });
        }
        const reservations = await Reservation.find({ salleId, startTime: { $lt: endTime }, endTime: { $gt: startTime } });
        if (reservations.length > 0) {
          return  res.status(400).json({ message: 'Salle already reserved' });

        }
        if(salle.dispo === false) {
            return res.status(400).json({ message: 'Salle not available' });
        }
      const reservation = new Reservation({ userId, salleId, startTime, endTime });
      await Salle.findByIdAndUpdate(salleId, {dispo:false})
      await reservation.save();
      sendMail(req.user.email, 'Reservation created', `Reservation created for salle ${salle.nom} from ${startTime} to ${endTime}` , false)
      res.redirect("/api/reservations")
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.update = async (req, res) => {
    try {
      const { startTime, endTime } = req.body;
      const reservationId = req.params.id; 
        if (startTime >= endTime) {
            return res.status(400).json({ message: 'Start time must be before end time' });
        }
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        const salle = await Salle.findById(reservation.salleId);
        if (!salle) {
            return res.status(404).json({ message: 'Salle not found' });
        }
        if(salle.dispo === false) {
            return res.status(400).json({ message: 'Salle not available' });
        }
        const reservations = await Reservation.find({ salleId: reservation.salleId, startTime: { $lt: endTime }, endTime: { $gt: startTime } });
        if (reservations.length > 0) {
            return res.status(400).json({ message: 'Salle already reserved' });
        }

      const reservationNew = await Reservation.findByIdAndUpdate(reservationId, { startTime, endTime }, { new: true });
      res.json(reservationNew);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.cancel = async (req, res) => {
    try {
      const reservationId = req.params.id; 
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

      await Salle.findByIdAndUpdate(reservation.salleId, {dispo:true})
      await Reservation.findByIdAndDelete(reservationId);
      res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };