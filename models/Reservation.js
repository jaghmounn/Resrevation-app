
const mongoose = require('mongoose');

const reservationSchema=mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salle', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

})


module.exports=mongoose.model("Reservation" , reservationSchema) ; 