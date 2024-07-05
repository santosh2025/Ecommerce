import Product from "../models/product.schema.js"
import formidable from "formidable"
import { s3Fileupload,s3deleteFile } from "../service/imageUpload.js"
import mongoose, { Mongoose } from "mongoose"
import asynHandler from "../service/asyncHandler.js"
import CustomError from "../utls/CustomError.js"
import config from "../config/index.js"
import fs from "fs"
import asyncHandler from "../service/asyncHandler.js"

/*************************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @description Users AWS S3 Bucket for image upload
 * @returns Product Object
 *************************************************************/
// uploading a file 

export const addProduct = asynHandler(async(req,res)=>{

    const form = formidable({multiples : true , keepExtensions : true});

    form.parse(req,async function (err , fields , files){
         if(err){
            throw new CustomError(err.message|| "Something wen wront",500)
         }

         let productId = new Mongoose.Types.ObjectId().toHexString()
      
        console.log(fields,files);
        
        if(!fields.name || !fields.price || !fields.description || !fields.collectionID){
            throw new CustomError("please fill all the fields" , 500)
        }

        let imgArrayResp = Promise.all(
            Object.keys(files).map(async(file,index) => {
                const element = file[fileKey]
                console.log(element);
                const data = fs.readFileSync(element.filepath)

                const upload = await s3Fileupload({
                    bucketName:config.S3_BUCKET_NAME,
                    key : 'products/${productId}/photo_${index+1}.png',
                    body : data,
                    contentType : element.mimetype
                })

                // productId = 123abc456
                // 1: products/123abc456/photo_1.png
                // 2: products/123abc456/photo_2.png
                
                console.log(upload);
                
                return {
                    secure_url : upload.Location
                }


            })
        )

        let imgArray = await imgArrayResp

        const product =  await Product.create({
            _id:productId,
            photos : imgArray,
            ...fields
        })

        if(!product){
            throw new CustomError("Product failed to be created in DB" , 400)
        }

        res.status(200).json({
           success : true,
           product,
        })  
    })
})

export const getAllProducts = asynHandler(async(req,res) => {
    
    const products = await Product.find({})


    if(!products){
        throw new CustomError("No Products found" , 404)
    }

    res.status(200).json({
        success : true,
        products,
    })
})

export const getProductById = asynHandler(async(req,res) => {

    const {id : productId} = req.params 

    const product = await Product.findById({productId});


    if(!product){
        throw new CustomError("product not found", 404)
    }

    res.status(200).json({
        success : true,
        product
    })
})

export const getProductByCollectionId = asynHandler(async(req,res) => {
   const {id : collectionId} = req.params

   const products = await Product.findById({collectionId})

   if(!products){
    throw new CustomError("No products found",404)
   }

   res.status(200).json({
     success : true,
     products
   })

})

export const deleteProduct = asynHandler(async(req,res) => {
    const {id: productId} = req.params

    const product = await Product.findById({productId})

    if(!product){
        throw new CustomError("Product to be deleted not found" , 404)
    }
    
   const deletePhotos = Promise.all(
        product.photos.map(async(element,index) =>{
            await s3deleteFile({
                bucketName : config,S3_BUCKET_NAME,
                key : 'products/${productId._id.toString()}/photo_${index+1}.png'
            })
        })
    )
    await deletePhotos;

    await Product.remove({productId})


    res.status(200).json({
        succes : true,
        message : "Product is been deleted successfull"
    })
})

export const addfavourite = asynHandler(async(req,res) => {
    
    const {id : collectionId} = req.params

    const product = await Product.findById(collectionId)
   
    if(!product){
        throw new CustomError("Product now found",400)
    }

    product.favourites = !product.favourites

    product.save()

    res.status(200).json({
        success : true,
        message : "Favourite product is added"
    })
})

export const searchProduct = asyncHandler(async(req,res) => {
    
    const {name} = req.body

    if(!name){
        throw new CustomError("Product name is required",400)
    }

    const products =  await Product.find({name:{$regex : name , $options : "i"}})
    
    if(!products){
        throw new CustomError("No product found",400)
    }

    res.status(200).json({
        sucess:true,
        products
    })
    
})