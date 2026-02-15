
import { Router } from 'express';
import { authenticate, authorize, lanRestriction } from '../middleware/auth.middleware';
import { SalesController } from '../controllers/sales.controller';
import { MedicineService } from '../services/medicine.service';

const router = Router();
const salesController = new SalesController();
const medicineService = new MedicineService();

// Global LAN restriction for production environments
router.use(lanRestriction);

// --- Auth Routes (Public) ---
router.post('/auth/login', (req, res) => { /* Logic in Auth Service */ });

// --- Medicine Routes ---
router.get('/medicines', authenticate, async (req, res) => {
    const list = await medicineService.getAllMedicines(req.query.q as string);
    res.json(list);
});

router.post('/medicines', authenticate, authorize('inventory.manage'), async (req, res) => {
    const med = await medicineService.createMedicine(req.body);
    res.status(201).json(med);
});

// --- Sales Routes ---
router.post('/sales', authenticate, authorize('sales.create'), salesController.createSale);

// --- Compliance Routes ---
router.get('/compliance/gst-report', authenticate, authorize('reports.view'), (req, res) => {
    // Aggregation logic for Phase 6
});

export default router;
