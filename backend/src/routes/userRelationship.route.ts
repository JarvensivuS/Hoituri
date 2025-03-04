import express, { Router } from 'express';
import { updateUserRelationships } from '../controllers/userRelationship.controller';
import { verifyUser } from '../middleware/authMiddleware';

// Create a router object
const router: Router = express.Router();

// Apply authentication middleware to this router
router.use(verifyUser);

// Register the route with the router
router.post('/users/:userId/relationships', updateUserRelationships);

// Export the router object, not the function
export default router;