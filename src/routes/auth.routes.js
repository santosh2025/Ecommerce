import { Router } from "express";
import { getProfile, login, logout, signup } from "../controllers/auth.controller.js";
import {authorize, isLoggedIn} from "../middleware/auth.middleware.js"



const router = Router()

router.post("/signup",signup)
router.get("/logout",logout)
router.post("/login",login)

router.get("/profile", isLoggedIn, getProfile)

//if i want ki sirf admin hi profile pe ja ske toh
//router.get("/profile",isLoggedIn,authorize(AuthRoles.ADMIN),getProfile)

export default router;