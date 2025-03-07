import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const Tags = mongoose.model("tags", tagSchema);
