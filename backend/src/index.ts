import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route';
import prescriptionRoutes from './routes/prescription.route';
import authRoutes from './routes/login.route';
import userRelationshipRoutes from './routes/userRelationship.route';
import locationRoutes from './routes/location.route';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', prescriptionRoutes);
app.use('/api', userRelationshipRoutes); 
app.use('/api', locationRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});