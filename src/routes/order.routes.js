import { Router } from "express";
import { generateOrder , updateOrderStatus,generateRazorpayOrderId,getAllOrders,getMyOrders} from "../controllers/order.controller.js";
import {authorize, isLoggedIn} from "../middleware/auth.middleware.js"
import AuthRoles from "../utls/authRoles.js";


const router = Router()

// todo add all routes 




export default router;