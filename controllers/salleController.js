const { render } = require("ejs");
const Salle = require("../models/salle");
const Reservation = require("../models/Reservation");

exports.getAllSalles = async (req, res) => {
    const salles = await Salle.find();  
    if(!salles) {
        return res.status(404).json({msg:"No salle found"})
    }   
    else{
        return res.render('showSalle', {salles})
    } 
}
exports.afficheForm = async (req,res) =>{
    const id = req.params.id
    if(!id) {
        res.render('addSalle')

    }
    else{
        try{
            const salle= await Salle.findOne({ _id:id}) ;
            if(!salle){
            }else{
                res.render('updateSalle', {salle})
                
            }
        } catch(error) {
            console.log(error)
            res.redirect("/api/salles")
        }

}
}
exports.getSalleById = async (req, res) => {
    const salle = await Salle.findById(req.params.id);
    if(!salle) {
        return res.status(404).json({msg:"No salle found"})
    }   
    else{
        return res.status(200).json(salle)
    } 
}
    
exports.addSalle = async (req, res) => {
    const {nom, capacite,dispo} = req.body;
    if(!nom) {
        return res.status(400).json({msg:"nom est obligatoire"}) ;  
    }
    if(!capacite) {
        return res.status(400).json({msg:"capacite est obligatoire"}) ;  
    }
    
    
    const salle = await Salle.create({
        nom,
        capacite,
        dispo
    });
    return res.status(201).json(salle);
}

exports.updateSalle = async (
    req,
    res
) => {
    const { nom, capacite , dispo } = req.body;
    const salle = await Salle.findById(req.params.id);
    if (!salle) {
        return res.status(404).json({ msg: "Salle not found" });
    }
    salle.nom = nom || salle.nom;
    salle.capacite = capacite || salle.capacite;
    salle.dispo = dispo || salle.dispo;
    
    await salle.save();
    
    return res.status(200).json(salle);
}

exports.deleteSalle = async (req, res) => {
    const salle = await Salle.findById(req.params.id);
    if (!salle) {
        return res.status(404).json({ msg: "Salle not found" });
    }
    await Reservation.deleteMany({ salleId: salle._id });
    await Salle. findByIdAndDelete(salle._id);

    return res.status(200).json({ msg: "Salle removed" });
}

