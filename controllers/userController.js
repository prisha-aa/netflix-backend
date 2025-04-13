
    import User from '../models/User.js';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    
    export const register = async (req, res) => {
      const { email, password } = req.body;
      try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User exists' });
    
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed });
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };
    
    export const login = async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Wrong password' });
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };
    