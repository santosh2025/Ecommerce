import { Router } from "express";
import {createCollection,updateCollection,getAllCollection,deleteCollection} from "../controllers/collection.controller.js";
import {authorize, isLoggedIn} from "../middleware/auth.middleware.js"
import AuthRoles from "../utls/authRoles.js";


const router = Router()

Router.post("/",isLoggedIn,authorize(AuthRoles.ADMIN , AuthRoles.MODERATOR),createCollection)

//delete a single collection
Router.delete("/:id" ,isLoggedIn,authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),deleteCollectionteCollection )

Router.put("/action/:id" , isLoggedIn,authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),updateCollection)

//get all collection
Router.get("/", isLoggedIn,authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),getAllCollection)

export default router;