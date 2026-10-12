import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { PostController } from "./post.controller";

const router = express.Router();

router.get("/", PostController.getAllPost);
router.get("/:postId", PostController.getPostById); //postid mane id
router.post("/", auth(UserRole.USER), PostController.createPost);

export const postRouter: Router = router;
