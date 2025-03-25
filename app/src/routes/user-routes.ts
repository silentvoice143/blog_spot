import express, { Request, Response } from "express";
import User, { IUser } from "../models/user";
import { authenticateToken } from "../middleware/auth-middleware";
const router = express.Router();

router.get("/", authenticateToken, async (req: any, res: any) => {
  try {
    console.log(req.user, "-----users");
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, users: users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
});


router.post("/getfollow",authenticateToken,async(req:any,res:any)=>{
 try{
  console.log(req.user)
  const {authorId}=req.body;
  const user:IUser=await User.findOne({ _id: req.user.id }).select("-password");
  console.log(user);
  const followList=await user.following;
 
  if(followList.includes(authorId)){
    return res.status(200).json({success:true,message:"You are already following this user.",follow:true})
  }else{
    return res.status(200).json({success:true,message:"You are not following this user.",follow:false})
  }
 }catch(err){
  console.log(err)
 }
})

router.post("/follow",authenticateToken,async(req:any,res:any)=>{
try{
  const {userId,followerId}=req.body;
  const user=await User.findByIdAndUpdate(userId,{$addToSet:{followers: followerId}}, {new: true})
  const follower=await User.findByIdAndUpdate(followerId,{$addToSet:{following: userId}}, {new:true});
  return res.status(200).json({success:true,message:"User followed successfully!"})
}catch(err){
  console.log("Something went wrong",err);
}
})

router.post("/unfollow", authenticateToken, async (req: any, res: any) => {
  try {
    const { userId, followerId } = req.body;

    // Check if both userId and followerId are provided
    if (!userId || !followerId) {
      return res.status(400).json({
        success: false,
        message: "Both userId and followerId are required."
      });
    }

    // Find the user and target user
    const user: IUser = await User.findById(userId);
    const targetUser: IUser = await User.findById(followerId);

    // Check if the user and target user exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found.`
      });
    }
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${followerId} not found.`
      });
    }

    // Check if the user is actually following the target user
    if (!user.following.includes(followerId)) {
      return res.status(400).json({
        success: false,
        message: `User with ID ${userId} is not following ${followerId}.`
      });
    }

    // Remove followerId from user's followers
    await User.findByIdAndUpdate(userId, {
      $pull: { following: followerId }
    }, { new: true });

    // Check if the target user is actually following the user
    if (!targetUser.followers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: `User with ID ${followerId} is not following ${userId}.`
      });
    }

    // Remove userId from target user's following
    await User.findByIdAndUpdate(followerId, {
      $pull: { followers: userId }
    }, { new: true });

    // Successful unfollow operation
    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully!"
    });
  } catch (err) {
    console.log("Something went wrong", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later."
    });
  }
});


router.get("/followings", async (req: any, res: any) => {
  try {
    const { userId } = req.body;
    const { limit = 10, page = 0 } = req.query; // Default limit of 10 and page 0 if not provided

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Ensure that the limit and page are valid numbers
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ success: false, message: "Invalid page or limit values" });
    }

    // Find the user and populate the followers and following fields with pagination
    const user = await User.findById(userId)
      .populate("following")  // Populate following
      .lean();  // Using .lean() to avoid Mongoose document overhead for simple JSON responses

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure that the followers and following are arrays
    const following = Array.isArray(user.following) ? user.following : [];

    // Paginate followers and following
    const totalFollowing = following.length;

    // Calculate the total number of segments (pages)
    const totalPagesFollowing = Math.ceil(totalFollowing / limitNumber);

    // Slice the followers and following arrays to get the correct segment
    const followingSegment = following.slice(pageNumber * limitNumber, (pageNumber + 1) * limitNumber);

    return res.status(200).json({
      success: true,
      following: followingSegment,
      totalPagesFollowing,
      currentPage: pageNumber,
      limit: limitNumber,
    });
  } catch (err) {
    console.log("Something went wrong", err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

router.get("/followers", async (req: any, res: any) => {
  try {
    const { userId } = req.body;
    const { limit = 10, page = 0 } = req.query; // Default limit of 10 and page 0 if not provided

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Ensure that the limit and page are valid numbers
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ success: false, message: "Invalid page or limit values" });
    }

    // Find the user and populate the followers and following fields with pagination
    const user = await User.findById(userId)
      .populate("followers")  // Populate followers
      .lean();  // Using .lean() to avoid Mongoose document overhead for simple JSON responses

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure that the followers and following are arrays
    const followers = Array.isArray(user.followers) ? user.followers : [];

    // Paginate followers and following
    const totalFollowers = followers.length;


    // Calculate the total number of segments (pages)
    const totalPagesFollowers = Math.ceil(totalFollowers / limitNumber);

    // Slice the followers and following arrays to get the correct segment
    const followersSegment = followers.slice(pageNumber * limitNumber, (pageNumber + 1) * limitNumber);

    return res.status(200).json({
      success: true,
      followers: followersSegment,
      totalPagesFollowers,
      currentPage: pageNumber,
      limit: limitNumber,
    });
  } catch (err) {
    console.log("Something went wrong", err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});


export default router;
