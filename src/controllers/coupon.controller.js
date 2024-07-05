import Coupon from "../models/coupon.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utls/CustomError.js"


/****************************************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @return Coupons Object with success message "Coupon Created SuccessFully"
 ****************************************************************************/

export const createCoupon = asyncHandler(async(req,res) => {
     
    const {code , discount}  = req.body
   
    if(!code || !discount){
        throw new CustomError("Both code and discout required" , 404)
    } 

    const isExist = await Coupon.findOne({code})

    if(isExist){
        throw new CustomError("Coupon already exists")
    }
    
    const coupon = await Coupon.create({
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
    
    const couponExist = await Coupon.findById(couponId)

    if(!couponExist){
        throw CustomError("Coupon does not exist with the provided id" , 404)
    }

    Coupon.findByIdAndDelete(couponId)

    res.status(200).json({
        success : true,
        message : "Coupon deleted successfully"
    })

})

export const getAllCoupons = asyncHandler(async(req,res) => {

    const coupons = await Coupon.find()

    if(!coupons){
        throw new CustomError("Coupons does not found " , 404)
    }

    res.status(200).json({
        success : true,
        coupons
    })
})

export const getAllActiveCoupons = asyncHandler(async(req,res) => {
   
     const activeCoupons = await Coupon.find({active : true})

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
    const coupounExist = await Coupon.findById(couponId)

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

export const updateCoupon = asyncHandler(async(req,res)=>{
    const {id : couponId} = req.params
    const {action} = req.body

    const coupon = await Coupon.findOneAndUpdate(couponId,{
        active : action
    },{
        new : true,
        runValidators : true
    })

    if(!coupon){
        throw new CustomError("Coupons not found ", 404)
    }

    res.status(200).json({
        success : true,
        message : "Coupon updated successfully",
        coupon
    })
})

export const updateCouponDiscount = asyncHandler(async(req,res)=>{
  
    const {id : couponId} = req.params
    const {discount} = req.body
    
    console.log(discount)

    const coupon = await Coupon.findByIdAndUpdate(couponId,{discount},{
        new : true,
        runValidators : true
    })

    if(!coupon){
        throw new CustomError("Coupon not found",400)
    }
    coupon.save();

    res.status(200).json({
        success: true,
        message : "Discount updated successfully"
    })
})