import { authenticateToken } from "./../middleware/auth-middleware";
import express from "express";
import Post from "../models/post";

const router = express.Router();

router.post("/", authenticateToken, async (req: any, res: any) => {
  try {
    const postData = {
      ...req.body,
      dop: new Date(),
      author: req.user.id,
      view: 0,
    };
    const post = new Post(postData);
    console.log(req.body, req.user, post);
    await post.save();
    return res
      .status(201)
      .json({ success: true, message: "successfully post created" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: true, error: err });
  }
});

router.post("/view/:postId",authenticateToken,async(req,res)=>{
  try{
    const {postId}=req.params;
    console.log(postId,"----post")
    const post=await Post.findById(postId);
    if(!post){
      return res.status(400).json({success:true,message:"Post not found!"})
    }

    post.view+=1;
    post.save();
    return res.status(200).json({success:true,message:"Post view added!",view:post.view})
  }catch(err){
     return res.status(400).json({ success: true, error: err });
  }
})

router.get("/", async (req: any, res: any) => {
  try {
    console.log("hitting this route");
    let category = req.query.category;
    let posts;
    if (category && category.length > 0) {
      posts = await Post.find({ category: category[0] }).populate(
        "author",
        "name email"
      );
    } else {
      posts = await Post.find().populate("author", "name email");
    }
    return res.status(200).json({ success: true, posts });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

router.get("/recommended",async(req,res)=>{
  try{
    const posts=await Post.find().populate("author","name email").sort({view:-1});
    return res.status(200).json({success:true,recommendedPost:posts});
  }catch(err){
    return res.status(400).json({error:err})
  }
})

router.get("/detail/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const post = await Post.findById({ _id: id })
      .populate("author", "name email")
     ;
    

    if (post) {
      delete post.__v;
      return res
        .status(200)
        .json({ message: "successfully get the post", post: post });
    } else {
      return res.status(400).json({ message: "Post not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

router.put("/:id",authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, content,description ,status} = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id },
      { $set: { title, content,description,status:status==="publish"?"publish":"draft"} },
      { new: true }
    );
    if (updatedPost) {
      return res.status(200).json({ message: "post updated successfully" ,updatedPost});
    } else {
      res.status(404).json({ message: "Post not found." });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: `Error updating post. ${error}` });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete({ _id: id });
    if (deletedPost) {
      res.json({ message: "Post deleted successfully." });
    } else {
      res.status(404).json({ message: "Post not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting post." });
  }
});

export default router;
