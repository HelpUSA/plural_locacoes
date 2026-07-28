import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';
import * as userController from '../controllers/userController.js';
import * as financialController from '../controllers/financialController.js';
import * as maintenanceController from '../controllers/maintenanceController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as reportsController from '../controllers/reportsController.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/google', authController.loginGoogle);
router.get('/auth/me', authenticateToken, authController.getMe);
router.put('/auth/me', authenticateToken, authController.updateProfile);

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
router.post('/admin/users', authenticateToken, requireAdmin, userController.createUser);
router.put('/admin/users/:id', authenticateToken, requireAdmin, userController.updateUser);
router.patch('/admin/users/:id/role', authenticateToken, requireAdmin, userController.updateUserRole);
router.delete('/admin/users/:id', authenticateToken, requireAdmin, userController.deleteUser);

// --- ERP Financial Routes ---
router.get('/admin/financial/summary', authenticateToken, requireAdmin, financialController.getFinancialSummary);
router.get('/admin/financial/transactions', authenticateToken, requireAdmin, financialController.getFinancialTransactions);
router.post('/admin/financial/transactions', authenticateToken, requireAdmin, financialController.createFinancialTransaction);

// --- ERP Maintenance & Supplier Routes ---
router.get('/admin/maintenance', authenticateToken, requireAdmin, maintenanceController.getMaintenanceLogs);
router.post('/admin/maintenance', authenticateToken, requireAdmin, maintenanceController.createMaintenanceLog);
router.patch('/admin/maintenance/:id/status', authenticateToken, requireAdmin, maintenanceController.updateMaintenanceStatus);
router.post('/admin/suppliers', authenticateToken, requireAdmin, maintenanceController.createSupplier);

// --- ERP Reports & BI Routes ---
router.get('/admin/reports/top-products', authenticateToken, requireAdmin, reportsController.getTopProductsReport);
router.get('/admin/reports/neighborhood-revenue', authenticateToken, requireAdmin, reportsController.getNeighborhoodRevenueReport);
router.get('/admin/reports/occupancy', authenticateToken, requireAdmin, reportsController.getOccupancyStats);

// --- ERP Company Settings Routes ---
router.get('/admin/settings', settingsController.getCompanySettings);
router.post('/admin/settings', authenticateToken, requireAdmin, settingsController.updateCompanySettings);

export default router;
