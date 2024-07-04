// signup a new user

import asyncHandler from "../service/asyncHandler";
import CustomError from "../utls/CustomError";
import User from "../models/user.schema.js"
import mailHelper from "../utls/mailHelper.js"

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

export const getProfile = asyncHandler(async(req,res) =>{
      
     const {user} = req

     if(!user){
        throw new CustomError("User not found" , 404)
     }

     res.status(200).json({
      success: true,
      user 
     })

})

export const forgotPassword = asyncHandler(async(req,res) => {
      
  const {email} = req.body

    if(!email){
       throw new CustomError("No Email provided", 404)
    }

    const user =  await User.findOne({email})

    if(!user){
      throw new CustomError("User does not exits", 404)
   }
   
   const resetToken = await User.generateForgotPasswordToken()
   
   await user.save({validateBeforeSave : false}) // because hmne method m scema me this m save kra h 
                     // this matlab current user islie save krna jruri h
                    // save krenege to sab kuch validate krega db vo chize hame
                    // chahiye hi nhi isliye validateBeforeSave false kra h  
   

     // resetUrl is the link that user gets on mail to reset password with token               
      const resetUrl = '${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}'
     
      const message = 'Your password reset token is as follows \n\n ${resetToken} \n\n if this was not requested by you, please ignore'

      try {
        await mailHelper({
            email : user.email,
            subject : "Password reset mail",
            message 
          })
      } catch ( error) {
            user.forgotPasswordToken = undefined
            user.forgotPasswordExpiry = undefined
            
            await user.save({validateBeforeSave: false})

            throw new CustomError(error.message || "Email could not be sent" ,500)
      }
})

export  const resetPassword = asyncHandler(async(req,res) =>{
    
   const {token :resetToken} = req.params
   const {password , confirmPassowrd} = req.body

   
  if(passoword !=+ confirmPassowrd){
    throw new CustomError("Password does not match",404)
  }

   const resetPasswordToken = crypto
   .createHash("sha256")
   .update(resetToken)
   .digest("hex")

    
  const user =  await User.findOne({
      forgotPasswordToken : resetPasswordToken,
      forgotPasswordExpiry : { $gt : Date.now() }
   })

   if(!user){
    throw new CustomError("password reset token is invalid or expired" , 404)
   }

   user.password = password; 

   user.forgotPasswordToken = undefined
   user.forgotPasswordExpiry = undefined
   
   await user.save();
   
   // optional 
   const token = user.getJWTtoken()
   res.cookie("token" , token , cookieOptions)

   res.status(200).json({
      success: true,
      user // choice
    })






})