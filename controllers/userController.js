const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const { sendMail } = require("../config/email");

const Register = async (req,res)=>{
console.log(req.body)

    const {nom , prenom ,telephone, email  , password} = req.body ;
    if(!nom) {
        return res.status(400).json({msg:"nom est obligatoire"}) ;  
    }
    if(!prenom) {
        return res.status(400).json({msg:"prenom est obligatoire"}) ;  
    }
    if(!telephone) {
        return res.status(400).json({msg:"telephone est obligatoire"}) ;  
    }
    if(!email) {
        return res.status(400).json({msg:"email est obligatoire"}) ;  
    }
  
    const existedUser =await  User.findOne({email:email})   ; 
    if(existedUser){
        return res.status(400).json({msg:"Ce email est deja utiliser "})
    }
   
   
    try {const salt=await bcrypt.genSalt(10)
        const hashedPass=await bcrypt.hash(password,salt) ; 

        const user=await User.create({
            nom,
            prenom,
            telephone,
            email,
            password:hashedPass

        

           //sendMail(user.email,"Inscription", "Bienvenue", false)

        })
        
        return res.redirect('/api/users/login')

    } catch (error) {
        res.status(500).json({msg:error.message})
    }
   
}
const SignIn = async (req,res) =>{
    const {email , password } = req.body  
    if(!email) {
        return res.status(400).json({msg:"email est obligatoire"})
    }
    if(!password) {
        return res.status(400).json({msg:"mot de passe est obligatoire"})
    }
    try {
        const ExistedUser = await User.findOne({email: email }) 
        if(!ExistedUser) {
                res.status(404).json({message : "Mot de passe ou email incorrecte "})
        }
        const isMatch = await bcrypt.compare(password , ExistedUser.password) ;
        if(!isMatch) {
            res.status(400).json({message:"Mot de passe ou email incorrecte "})
        }   
        const token  = jwt.sign({
            id: ExistedUser._id,
        }, process.env.SECRET_KEY, { expiresIn: "30d" })
       
        
        
        res.cookie("token", token);
        res.redirect ('/dashboard' , {token : token}, ()=> console.log("token added"))
     


    } catch (error) {
        res.json({message : error.message}) 
    }

}

module.exports = {
    Register , 
    SignIn
}