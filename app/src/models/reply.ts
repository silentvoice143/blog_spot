import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  user: {
    type: String, // you can use ObjectId if you're linking to a User model
    required: true
  },
  text: {
    type: String,
    required: true
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
    required: true
  },
  parentReplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reply'  // This allows replies to replies
  },
  
},{timestamps:true});

const Reply = mongoose.model('reply', ReplySchema);
export default Reply;
