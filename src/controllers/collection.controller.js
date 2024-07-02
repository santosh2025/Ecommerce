import Collection from "../models/collection.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utls/CustomError"


export const createCollection = asyncHandler(async(req,res)=>{
    const {name} = req.body

    if(!name){
        throw new CustomError("Collection name is required ",400)
    }

  const collection = await Collection.create({
        name :name
    })
    
    res.status(200).json({
        success : true,
        message : "Collection was created successfully",
        collection
    })
})

export const updateCollection = asyncHandler(async(req,res)=>{
    const {name} = req.body
    const {id: collectionId} = req.params
    // req.params means we are geting it from routes or u can say urls
    

    if(!name){
        throw new CustomError("Collection name is required ",400)
    }

   let updatedCollection = await Collection.findByIdAndUpdate(collectionId,{
        name:name,
    },{
        new : true,
        runValidators : true
    })

    if(!updatedCollection){
        throw new CustomError("Collection not found",400)
    }
    res.status(200).json({
        success : true,
        message : "Collection updated successfully",
        updatedCollection
    })
})

export const delettCollection = asyncHandler(async(req,res)=>{
    const {id: collectionId} = req.params
    // req.params means we are geting it from routes or u can say urls
   
     const collectionToDelete = await Collection.findById(collectionId)

    if(!collectionToDelete){
        throw new CustomError("Collection to be deleted not found",400)
    }
    
    await collectionToDelete.remove()

    res.status(200).json({
        success : true,
        message : "Collection deleted successfully"
    })
})

export const  getAllCollection = asyncHandler(async(req,res) =>{
     
    const collections = await Collection.find()

    if(!collections){
        throw new CustomError("No Collentions found",400)
    }

    res.status(200).json({
        success : true,
        collections
    })


})

