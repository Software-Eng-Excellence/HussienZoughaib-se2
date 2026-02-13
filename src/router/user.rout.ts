import { UserController } from "../controller/User.controller";
import { Router } from "express";
import { UserManagement } from "../service/UserManagement";
import { asyncHandler } from "../midlleware/asyncHandler";
import { authenticate } from "../midlleware/auth.middleware";

const router = Router();
const userManagement = new UserManagement();
const userController = new UserController(userManagement);


// Define your routes here
router.route('/:id')
    .get(authenticate,asyncHandler(userController.GetUser.bind(userController)))
    .put(authenticate,asyncHandler(userController.UpdateUser.bind(userController)))
    .delete(authenticate,asyncHandler(userController.DeleteUser.bind(userController)));

router.route('/')
    .get(authenticate,asyncHandler(userController.GetAllUsers.bind(userController)))
    .post(asyncHandler(userController.CreateUser.bind(userController)));

export default router;
