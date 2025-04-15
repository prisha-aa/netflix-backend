import User from "../models/User"


export const getWatchlist=async(req,res)=>{
    try{
        const user=await User.findById(req.user);
        res.json({watchlist:user.watchlist});

    } catch (err){
        res.status(500).json({message:"error fetching watchlist"});
    }
};


export const addToWatchlist=async(req,res)=>{
    const {movieId}=req.body;
    try{
        const user=await User.findById(req.user);
        if (!user.watchlist.includes(movieId)){
            user.watchlist.push(movieId);
            await user.save();
        }
        res.json({watchlist:user.watchlist});

    } catch (err){
        res.status(500).json({message:"error adding to watchlist"});
    }
};

export const removeFromWatchlist=async(req,res)=>{
    const {movieId}=req.body;
    try{
        const user=await User.findById(req.user);
        user.watchlist = user.watchlist.filter(id=>id!==movieId);
        await user.save();
        res.json({watchlist:user.watchlist});

    } catch (err){
        res.status(500).json({message:"error removing from watchlist"});
    }
};