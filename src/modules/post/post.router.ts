import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { PostController } from "./post.controller";

const router = express.Router();

router.get("/", PostController.getAllPost);

router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPosts,
);

router.get("/stats", auth(UserRole.ADMIN), PostController.getStats);
router.get("/:postId", PostController.getPostById); //postid mane id
router.patch("/:postId", auth(UserRole.USER), PostController.updateMyPost);
router.delete("/:postId", auth(UserRole.USER), PostController.deleteMyPost);

router.post("/", auth(UserRole.USER), PostController.createPost);

export const postRouter: Router = router;
