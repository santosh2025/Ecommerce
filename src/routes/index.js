import { Router } from "express";
import authRoutes from "./auth.route.js"
import coupounRoutes from "./coupons.routes.js"
import collectionRoute from "./collection.routes.js"
// isme jese sare route jo jo bhi bnaye h vo export nahi krne pdege app.js m sirf
// index.js ko import kr k kre lenge sab kind of central file for all the routes exports

const router = Router()

router.use("/auth", authRoutes)
router.use("/coupon", coupounRoutes)
router.use("/collection", collectionRoute)
// /auth/signup




export default router