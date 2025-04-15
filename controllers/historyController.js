import User from "../models/User";

export const getHistory=async(req,res)=>{
    try{
        const user=await User.findById(req.user);
        res.json({history:user.history});

    } catch (err){
        res.status(500).json({message:"error fetching histroy"});
    }
};


export const addToHistory=async (req,res)=>{
    const {movieId}=req.body;
    try{
        const user= await User.findById(req.user);
        user.history=user.history.filter(id=>id!==movieId);
        user.history.push(movieId);
        await user.save();
        res.json({history:user.history});
    }
    catch(err){
        res.status(500).json({message:"error dding to history"});
    }
};