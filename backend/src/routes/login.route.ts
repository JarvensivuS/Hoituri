import express, { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { login } from '../controllers/login.controller';

const router = express.Router();

const loginHandler: RequestHandler = async (req, res) => {
  await login(req, res);
};

router.post('/login', loginHandler);

export default router;