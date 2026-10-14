import { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.service";

//create post
const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

//getCommentById
const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//getCommentby authorId
const getCommentByAuthorId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorId } = req.params;
    console.log("authorId", authorId);
    const result = await commentService.getCommentByAuthorId(
      authorId as string,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.deleteComment(
      commentId as string,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//update comment
const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.updateComment(
      commentId as string,
      req.body,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//update comment
const moderateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    const result = await commentService.moderateComment(
      commentId as string,
      req.body,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
  moderateComment,
};
