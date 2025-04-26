import { register, login } from '../controllers/userController.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock User model, bcrypt, jwt
jest.mock('../models/User.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
  });

  describe('register', () => {
    it('should return 400 if user exists', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockResolvedValue({}); // user exists

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User exists' });
    });

    it('should create user and return token', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockResolvedValue(null); // no user
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.create.mockResolvedValue({ _id: 'userid' });
      jwt.sign.mockReturnValue('jsonwebtoken');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: 'jsonwebtoken' });
    });

    it('should handle errors', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockRejectedValue(new Error('Database error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('login', () => {
    it('should return 400 if user not found', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockResolvedValue(null); // no user

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 400 if password is wrong', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockResolvedValue({ password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(false); // wrong password

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' });
    });

    it('should login and return token', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockResolvedValue({ _id: 'userid', password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jsonwebtoken');

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'jsonwebtoken' });
    });

    it('should handle errors', async () => {
      req.body = { email: 'test@example.com', password: 'password' };
      User.findOne.mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
