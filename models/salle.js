
const mongoose = require('mongoose');

const salleSchema=mongoose.Schema({
    nom:{
        type:String,
        required:true,
        
    }   , 
    
   
    capacite:{
        type:Number,
        },
    dispo : {
        type:Boolean,
        default:true
    },

 

})


module.exports=mongoose.model("Salle" , salleSchema) ; 