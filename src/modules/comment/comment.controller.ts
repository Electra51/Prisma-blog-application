import { Request, Response } from "express";
import { commentService } from "./comment.service";

//create post
const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment creation failed",
      details: err,
    });
  }
};

//getCommentById
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment fetched failed",
      details: err,
    });
  }
};

//getCommentby authorId
const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    console.log("authorId", authorId);
    const result = await commentService.getCommentByAuthorId(
      authorId as string,
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Comment fetched failed",
      details: err,
    });
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
};
