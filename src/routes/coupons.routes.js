import { Router } from "express";
import { createCoupon , deletecoupon,getAllCoupons,updateCoupon} from "../controllers/coupon.controller.js";
import {authorize, isLoggedIn} from "../middleware/auth.middleware.js"
import AuthRoles from "../utls/authRoles.js";


const router = Router()

router.post("/",isLoggedIn,authorize(AuthRoles.ADMIN),createCoupon)
router.delete("/:id",isLoggedIn,authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),deletecoupon )

router.put("/action/:id" ,isLoggedIn,authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),updateCoupon)
router.get("/" ,isLoggedIn,authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),getAllCoupons)

export default router;