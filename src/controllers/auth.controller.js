// signup a new user

import asyncHandler from "../service/asyncHandler";
import CustomError from "../utls/CustomError";
import User from "../models/user.schema.js"

export const cookieOptions = {
    expires : new Date(Date.now()+ 3 * 24 * 60 * 60 * 1000), 
    httpOnly : true
}

/*************************************************************
 * @SIGNUP
 * @route https://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @return User Object
 *************************************************************/

export const signup = asyncHandler(async(req,res) => {
      // get data from user

      const {name , email , password} = req.body

      // multiple validation 
      if(!name || !email || !password){
        //throw new Error('Requires fill')
        throw new CustomError("Please add all fields" , 400)
      }
      
      // lets add this data to data base
      
      // checking if user already exist 
      const existingUser = await User.findOne({email})

      if(existingUser){
          throw new CustomError("User already exists" , 400)
      }

      const user = await User.create({
        name,  // name : name 
        email , // email : email
        password // password : password
      })

      const token = user.getJWTtoken() 
      // safety
      user.password = undefined
      
      // store this token in user's cookie
      res.cookie("token" , token,cookieOptions)

      // send back a response to user
      res.status(200).json({
        success : true,
        token,
        user
      })

})

export const login = asyncHandler(async(req,res) => {
  
  const {email,password} =  req.body

   // validation 
   if(!email || !password){
    throw CustomError("Please fill all details" , 400)
   }

   // checking existence or not 
   const user = User.findOne({email}).select("+password")
   
  if(!user){
     throw CustomError("Invalid credentials" , 400)
  }
  
    const isPasswordMatched = await user.comparePassword(password)

    if(isPasswordMatched){
      const token = user.getJWTtoken()
      user.password = undefined
      res.cookie("token", token , cookieOptions)
      return res.status(200).json({
        success : true,
        token ,
        user
      })
    }      

    throw new CustomError("Password is incorrect",400)
})

export const logout = asyncHandler(async(req,res) => {
    
     res.cookie("token" , null , {
      expires : new Date(Date.now()),
      httpOnly: true
      })

      res.status(200).json({
        success : true,
        message: 'Logged Out'
      })
})