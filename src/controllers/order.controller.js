import Product from "../models/product.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utls/CustomError"
import Coupon from "../models/coupon.schema.js"
import Order from "../models/order.schema.js"
import Razorpay from "../config/rozorpay.config.js"
import razorpay from "../config/rozorpay.config.js"

export const generateRazorpayOrderId = asyncHandler(async(req,res)=>{
   
    const {products , couponCode} = req.body

    if(!products || products.length === 0){
        throw new CustomError("No product found", 400)
    }
    
    let totalAmount = 0
    let discountAmount = 0

    // calculation 

    let productPriceCalc = Promise.all(
        products.map(async(product) =>{
            const {productId , count} = product;
            const productFromDB = await Product.findById(productId)

            if(!productFromDB){
                throw new CustomError("No product found",400)
            }
            if(productFromDB.stock < count){
                return res.status(400).json({
                    error :"Product quantity not in stock"
                })
            }
            totalAmount += productFromDB.price * count
        })
    )

    await productPriceCalc;

    const coupon = await Coupon.findOne({couponCode})

    if(!coupon || !coupon.active){
       throw new CustomError("No Such Coupons found or it may be expired")
    }
   
    if(coupon && coupon.active){
        discountAmount = coupon.discount;
    }

    const options = {
        amount : productPriceCalc - discountAmount,
        currency : "INR",
        receipt : 'receipt_$(new Date().getTime()}'
    }

    const order = await razorpay.orders.create(options)

    if(!order){
        throw new CustomError("Unable to generate order", 400)
    }

    res.status(200).json({
        success: true,
        message : "razor order id generated successfully",
        order
    })
})

// todo :  add order in database and update product stock , krna h
export const generateOrder = asyncHandler(async(req,res) =>{
   
   const {transactionId , product , Coupon , coupon , amount , phoneNumber ,address} = req.body

   const order = await Order.create({
      transactionId , coupon , phoneNumber , user,product,amount , address
   })

   const updateProducts = Promise.all(product.map(async(product) => {
       const {productId , count} = product
       
       const productFromDB = await Product.findById(productId)

       if(!productFromDB){
          throw new CustomError("Product not found" , 404)
       }

       if(productFromDB.stock < count){
          throw new CustomError("Out of stock",404)
       }

       productFromDB.stock = productFromDB.stock - count;
       productFromDB.sold = productFromDB.sold + 1;
       
       productFromDB.save();
       
   })) 
   

})

// todo : get only my order , krna abhi
export const getMyOrders = asyncHandler(async(req,res) =>{
    //
})

// todo : get only my order :ADMIN , krna abhi
export const getAllOrders = asyncHandler(async(req,res) =>{
    //
})

//todo update order status: ADMIN
export const updateOrderStatus = asyncHandler(async(req,res) =>{
    //
})
