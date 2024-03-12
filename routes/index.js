import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';

const router = express.Router();
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

export default router;
