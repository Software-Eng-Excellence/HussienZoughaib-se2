import { OrderController } from "../controller/Order.controller";
import { Router } from "express";
import { OrderManagement } from "../service/OrderMangmnet";
import { asyncHandler } from "../midlleware/asyncHandler";

const router=Router();
const ordercontroller =new OrderController(new OrderManagement());

// Define your routes here
router.route('/:id').get(asyncHandler(ordercontroller.GetOrder.bind(ordercontroller)))
.put(asyncHandler(ordercontroller.UpdateOrder.bind(ordercontroller)))
.delete(asyncHandler(ordercontroller.DeletOrder.bind(ordercontroller)));
router.route('/').
get(asyncHandler(ordercontroller.GetAllOrders.bind(ordercontroller)))
.post(asyncHandler(ordercontroller.CreateOrder.bind(ordercontroller)))

export default router;