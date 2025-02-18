import express from 'express';
import userRoutes from './routes/user.route';
import prescriptionRoutes from './routes/prescription.route';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', prescriptionRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});