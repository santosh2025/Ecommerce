import { config } from "../config/index.js"
import crypto from "crypto'"
import CustomError from "./CustomError"

const verifyPayment = async(pamentdata) => {

    const { razorpay_signature, razorpay_payment_id, transactionId } = pamentdata

    const generateSignature = crypto
       .createHash("sha256" , config.RAZORPAY_SECRET)
       .update('${transactionId}|${razorpay_payment_id}')
       .digest("hex")


   if(generateSignature === razorpay_signature){
       return true
   }else{
      throw new CustomError("Payement verification failed" , 400)
   } 
}

export default verifyPayment