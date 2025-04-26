import express from "express"
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js';
import userRoutes from './routes/userRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

dotenv.config({ path: '.env.local' });
const app= express();
app.use(cors());
app.use(express.json());

app.use('/api',movieRoutes);
app.use('/api',userRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/history', historyRoutes);

const PORT=process.env.PORT

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected")
    app.listen(PORT,()=> console.log(`server running on port ${PORT}`));
})
.catch(err=>console.log(err));
