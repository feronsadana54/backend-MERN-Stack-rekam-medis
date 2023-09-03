// models/blog.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  gambarBlog: {
    type: String,
  },
  penulis: {
    type: String,
    required: true,
  },
  judul: {
    type: String,
    required: true,
  },
  artikel: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
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
      penulis: {
        type: String,
      },
      profile: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
