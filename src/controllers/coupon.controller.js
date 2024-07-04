import Coupons from "../models/coupon.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utls/CustomError.js"


export const addCoupon = asyncHandler(async(req,res) => {
     
    const {code , discount}  = req.body
   
    if(!code || !discount){
        throw new CustomError("Both code and discout required" , 404)
    } 

    const isExist = await Coupons.findOne({code})

    if(isExist){
        throw new CustomError("Coupon already exists")
    }
    
    const coupon = await Coupons.create({
        code,
        discount
    })

    if(!coupon){
       throw CustomError("Coupon is not created" , 404)
    }

    res.status(200).json({
        success : true,
        message : "Coupon added successfully",
        coupon
    })
})

export const deleteCoupon = asyncHandler(async(req,res) => {
    const {id : couponId} = req.params

    if(!couponId){
        throw CustomError("Please provide the coupon id" , 404)
    }
    
    const couponExist = await Coupons.findById({couponId})

    if(!couponExist){
        throw CustomError("Coupon does not exist with the provided id" , 404)
    }

    Coupons.findByIdAndDelete(couponId)

    res.status(200).json({
        success : true,
        message : "Coupon deleted successfully"
    })

})

export const getAllCoupons = asyncHandler(async(req,res) => {

    const coupons = await Coupons.find()

    if(!coupons){
        throw new CustomError("Coupons does not found " , 404)
    }

    res.status(200).json({
        success : true,
        coupons
    })
})

export const getAllActiveCoupons = asyncHandler(async(req,res) => {
   
     const activeCoupons = await Coupons.find({active : true})

     if(!activeCoupons){
        throw new CustomError("No Active Coupons" , 404)
     }

     res.status(200).json({
        success : true,
        activeCoupons
     })
})

export const disableCoupon = asyncHandler(async(req,res) => {
   
    const {id : couponId} = req.params
    const coupounExist = await Coupons.findById(couponId)

    if(!coupounExist){
        throw new CustomError("Coupon does not exist" ,404)
    }

   Coupons.findById(couponId,{
     active:false
   })

   res.status(200).json({
     success :  true,
     message :  " Coupon disabled successfully"
   })
})