import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { CommentController } from "./comment.controller";

const router = express.Router();

router.get(
  "/author/:authorId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.getCommentByAuthorId,
);

router.get(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.getCommentById,
);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment,
);

export const commentRouter: Router = router;
