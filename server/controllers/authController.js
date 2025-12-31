const User = require("../models/User")
const jwt = require("jsonwebtoken")




// Register User

exports.register = async(req,res)=>{
    try{
        const {name, email, password} = req.body

        // Check if user exist
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }

        // Create new user
        const user = await User.create({name, email, password})

        // Create JWT token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn: "7d"
        })


        res.status(201).json({
            success: true,
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error",error:error.message})
    }
}




// Login User

exports.login = async(req,res)=>{
    try{
        
        const {email, password} = req.body

        //find user
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "User not found or invalid credentials"})
        }

        //check password
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(400).json({message: "user not found or invalid credentials"})
        }

        //create JWt token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn: "7d"
        })

        res.status(200).json({
            success: true,
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })



    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error",error:error.message})
    }
}