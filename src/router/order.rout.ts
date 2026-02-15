import { OrderController } from "../controller/Order.controller";
import { Router } from "express";
import { OrderManagement } from "../service/OrderMangmnet";
import { asyncHandler } from "../midlleware/asyncHandler";
import { AnaltycController } from "../controller/AnaltycController";
import { AnaltycService } from "../service/AnaltycService";
import { hasPermission } from "../midlleware/autharize";
import { Permission } from "../config/roles";

const router=Router();
const ordercontroller =new OrderController(new OrderManagement());
const analtycController=new AnaltycController(new AnaltycService(new OrderManagement()  ));
// Define your routes here
router.route('/:id').
get(hasPermission(Permission.READ_ORDER),asyncHandler(ordercontroller.GetOrder.bind(ordercontroller)))
.put(hasPermission(Permission.UPDATE_ORDER),asyncHandler(ordercontroller.UpdateOrder.bind(ordercontroller)))
.delete(hasPermission(Permission.DELETE_ORDER),asyncHandler(ordercontroller.DeletOrder.bind(ordercontroller)));
router.route('/').
get(asyncHandler(ordercontroller.GetAllOrders.bind(ordercontroller)))
.post(asyncHandler(ordercontroller.CreateOrder.bind(ordercontroller)))
router.route('/analytics/total-revenue')
.get(asyncHandler(analtycController.GetTotalRevenue.bind(analtycController)));
router.route('/analytics/total-orders')
.get(asyncHandler(analtycController.GetTotalOrders.bind(analtycController)));
router.route('/analytics/orders-by-category')
.get(asyncHandler(analtycController.GetOrdersByCategory.bind(analtycController)));
router.route('/analytics/revenue-by-category')
.get(asyncHandler(analtycController.GenrateRevenueByCategory.bind(analtycController)));
export default router;