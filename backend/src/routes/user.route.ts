import express, { Request, Response, Router } from 'express';
import { RequestHandler } from 'express-serve-static-core';

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller';

const router: Router = express.Router();

interface TypedRequestHandler<T = any> extends RequestHandler {
  (req: Request, res: Response): Promise<T> | T;
}

const createUserHandler: TypedRequestHandler = async (req, res) => {
  await createUser(req, res);
};

const getUsersHandler: TypedRequestHandler = async (req, res) => {
  await getUsers(req, res);
};

const getUserByIdHandler: TypedRequestHandler = async (req, res) => {
  await getUserById(req, res);
};

const updateUserHandler: TypedRequestHandler = async (req, res) => {
  await updateUser(req, res);
};

const deleteUserHandler: TypedRequestHandler = async (req, res) => {
  await deleteUser(req, res);
};

router.post('/users', createUserHandler);
router.get('/users', getUsersHandler);
router.get('/users/:id', getUserByIdHandler);
router.put('/users/:id', updateUserHandler);
router.delete('/users/:id', deleteUserHandler);

export default router;