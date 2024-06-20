import mongoose from "mongoose";
import AuthRoles from "../utls/authRoles.js"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({

    name : {
        type : String ,
        required : ["true" , " Name is required"],
        maxLength : [50 ,"Name must be less than 50 chars"] 
    },
    email : {
        type : String,
        required : ["true" , " Email is required"],
    },
    password:{
        type : String,
        required : ["true" ," Password is required"],
        minLength :[8,"password must be at least 8 chars"],
        select : false
    },
    role:{
        type : String,
        enum : Object.values(AuthRoles),
        default : AuthRoles.USER
    },
    // for forget password add these two  
    forgotPasswordToken : String ,
    forgotPasswordExpiry : Date
} , {timestamps : true})

// Encrypt the password before saving

userSchema.pre("save", async function(next){
    // next is kind of middleware or say flag that i stop something 
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

// compare password ham yaha decryt nhi kr rhe password ko encypt kr k 
// jo database m h usse check kr rhe h
userSchema.methods = {
     
    comparePassword : async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    }
}

export default mongoose.model("User",userSchema)