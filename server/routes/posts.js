import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ---------- Get all posts (public) ---------- */
router.get("/", async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

/* ---------- Create a post (logged-in) ---------- */
router.post("/", auth, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "Text required" });

  const post = await Post.create({
    userId: req.user.id,
    userName: req.user.name,
    text: text.trim(),
    likes: [],
  });

  res.status(201).json(post);
});

/* ---------- Like / Unlike (toggle) ---------- */
router.put("/:id/like", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const uid = String(req.user.id);
  const idx = (post.likes || []).findIndex((u) => String(u) === uid);

  if (idx === -1) post.likes.push(uid); // like
  else post.likes.splice(idx, 1);       // unlike

  await post.save();

  // return refreshed list to keep UI simple
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

/* ---------- Edit post (owner only) ---------- */
router.put("/:id", auth, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "Text required" });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (String(post.userId) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not your post" });
  }

  post.text = text.trim();
  await post.save();

  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

export default router;
