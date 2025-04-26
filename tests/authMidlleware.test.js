import { authenticate } from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';

// Mock jwt.verify
jest.mock('jsonwebtoken');

describe('authenticate middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', () => {
    req.header.mockReturnValue(null);

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    req.header.mockReturnValue('Bearer validtoken');
    jwt.verify.mockReturnValue({ id: 'userId' });

    authenticate(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
    expect(req.user).toBe('userId');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.header.mockReturnValue('Bearer invalidtoken');
    jwt.verify.mockImplementation(() => { throw new Error('invalid') });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});
