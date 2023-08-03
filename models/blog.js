// models/blog.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  gambarBlog: {
    type: String, // Path gambar
  },
  judul: {
    type: String,
    required: true,
  },
  artikel: {
    type: String,
  },
  konten: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
