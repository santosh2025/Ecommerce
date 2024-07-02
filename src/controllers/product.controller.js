import Product from "../models/product.schema.js"
import formidable from "formidable"
import { s3Fileupload,s3deleteFile } from "../service/imageUpload.js"
import mongoose, { Mongoose } from "mongoose"
import asynHandler from "../service/asyncHandler.js"
import CustomError from "../utls/CustomError.js"
import config from "../config/index.js"

/*************************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @description Users AWS S3 Bucket for image upload
 * @returns Product Object
 *************************************************************/


export const addProduct = asynHandler(async(req,res)=>{

    const form = formidable({multiples : true , keepExtensions : true});

    form.parse(req,async function (err , fields , files){
         if(err){
            throw new CustomError(err.message|| "Something wen wront",500)
         }

         let productId = new Mongoose.Types.ObjectId().toHexString()
      
        console.log(fields,files);

        
    })
     



})