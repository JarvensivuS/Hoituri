import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route';
import prescriptionRoutes from './routes/prescription.route';
import authRoutes from './routes/login.route';
import userRelationshipRoutes from './routes/userRelationship.route';

const app = express();

app.use(cors());
app.use(express.json());

// Use the router objects, not the controller functions directly
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', prescriptionRoutes);
app.use('/api', userRelationshipRoutes); // This should be a router, not a function

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});