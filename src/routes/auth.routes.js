import { Router } from "express";
import { forgotPassword, getProfile, login, logout, resetPassword, signup } from "../controllers/auth.controller.js";
import {authorize, isLoggedIn} from "../middleware/auth.middleware.js"



const router = Router()

router.post("/signup",signup)
router.get("/logout",logout)
router.post("/login",login)

router.post("/password/forgot",forgotPassword)
router.post("/password/reset/:token",resetPassword)

router.get("/profile", isLoggedIn, getProfile)

//if i want ki sirf admin hi profile pe ja ske toh
//router.get("/profile",isLoggedIn,authorize(AuthRoles.ADMIN),getProfile)

export default router;