import { Router } from "express";
import OrderRouter from './order.rout'

const router=Router();

// Define your routes here
    router.use('/orders', OrderRouter);

export default router;