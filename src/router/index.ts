import { Router } from "express";
import OrderRouter from './order.rout'
import UserRouter from './user.rout'
import Authrouter from './auth.rout'
import { authenticate } from "../midlleware/auth.middleware";

const router=Router();

// Define your routes here
    router.use('/orders',authenticate, OrderRouter);
    router.use('/users', UserRouter);
    router.use('/auth',Authrouter);

export default router;