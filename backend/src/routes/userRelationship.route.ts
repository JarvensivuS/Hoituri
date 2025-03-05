import express, { Router } from 'express';
import { updateUserRelationships } from '../controllers/userRelationship.controller';
import { verifyUser } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(verifyUser);

router.post('/users/:userId/relationships', updateUserRelationships);

export default router;