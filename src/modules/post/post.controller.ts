import { NextFunction, Request, Response } from "express";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";
import { postService } from "./post.service";

//create post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
  console.log("user", req.user);

  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

//get all posts
const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    //true or false
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;
    //status
    const status = req.query.status as PostStatus | undefined;
    console.log(isFeatured);

    //authorId
    const authorId = req.query.authorId as string | undefined;

    //pagination

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Post fetch failed:", err);

    return res.status(400).json({
      error: "Post fetch failed",
    });
  }
};

//get post by id
const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post id is required!");
    }
    const result = await postService.getPostById(postId as string); //service a jacche
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

//get post by id
const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const result = await postService.getMyPosts(user?.id as string); //service a jacche
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

//update my post
const updateMyPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }

    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    console.log(user);
    const result = await postService.updateMyPost(
      postId as string,
      req.body,
      user?.id as string,
      isAdmin,
    ); //service a jacche
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

//delete my post
const deleteMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }

    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    console.log(user);
    const result = await postService.deleteMyPost(
      postId as string,
      user?.id as string,
      isAdmin,
    ); //service a jacche
    res.status(200).json(result);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "my post delete failed";
    res.status(400).json({
      error: errorMessage,
      details: err,
    });
  }
};
//get stats for dashboard
const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.getStats(); //service a jacche
    res.status(200).json(result);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "stats fetch failed";
    res.status(400).json({
      error: errorMessage,
      details: err,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updateMyPost,
  deleteMyPost,
  getStats,
};
