import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { healthcheck } from "../controllers/healthcheck.controller.js";


const router  = Router()

router.route("/").post(healthcheck)

export default router