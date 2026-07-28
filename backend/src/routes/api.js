import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';
import * as userController from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/google', authController.loginGoogle);
router.get('/auth/me', authenticateToken, authController.getMe);

// --- Product Routes ---
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authenticateToken, requireAdmin, productController.createProduct);
router.put('/products/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/products/:id', authenticateToken, requireAdmin, productController.deleteProduct);

// --- Order / Quote Routes ---
router.post('/orders', (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
}, orderController.createOrder);

router.get('/orders/my-orders', authenticateToken, orderController.getMyOrders);
router.get('/admin/orders', authenticateToken, requireAdmin, orderController.getAllOrders);
router.patch('/admin/orders/:id/status', authenticateToken, requireAdmin, orderController.updateOrderStatus);

// --- User Management Routes ---
router.get('/admin/users', authenticateToken, requireAdmin, userController.getUsers);
router.patch('/admin/users/:id/role', authenticateToken, requireAdmin, userController.updateUserRole);

export default router;
