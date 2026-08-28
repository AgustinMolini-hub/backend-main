import { Router } from 'express';
import { MockController } from '../controllers/mock.controller.js';

const router = Router();

router.get('/users', MockController.getUsers);
router.get('/drivers', MockController.getDrivers);
router.get('/all', MockController.getAll);
router.get('/logger-test', MockController.testLogger);
router.post('/seed', MockController.seed);

export default router;
