import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : ["true" , " please provide a product name"],
        trim : true,
        maxLength : [120 , "product name should not be max than 120"]
   },
    price : {
        type : Number,
        required : ["true" , "please provide a product price"],
        maxLength:[5,"product name should not be max tha 5 chars"]
    },
    description:{
        type:String,   
    },
    photos: [
        {
            secure_url :{
                type : String,
                required : true
            }
        }
    ],
    stock : {
        type : Number,
        default : 0
    },
    sold : {
        type : Number,
        default : 0
    },
    collectionId :{
         type : mongoose.Schema.Types.ObjectId,
         ref : "Collection"
    },
    favourites:{
        type : Boolean,
        default : false
    }
},
{timestamps: true})




export default mongoose.model("Product" , productSchema)