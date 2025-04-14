const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // who receives it
  type: {
    type: String,
    enum: ["follow", "comment", "new_post"],
    required: true,
  },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // who triggered it
  post: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: false }, // only for comments
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
