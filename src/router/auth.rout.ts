
import { Router } from "express";

import { asyncHandler } from "../midlleware/asyncHandler";
import { AuthenticationService } from "../service/Authentication.Service";
import { UserManagement } from "../service/UserManagement";
import { AuthController } from "../controller/Auth.Controler";
import { authenticate } from "../midlleware/auth.middleware";

const router = Router();
const authService= new AuthenticationService();
const userService= new UserManagement();
const authController = new AuthController(authService,userService);


// Define your routes here
router.route('/login')
  .post(asyncHandler(authController.login.bind(authController)))
  
router.route('/logout')
  .get(authenticate,asyncHandler(authController.logout.bind(authController)))
export default router;
