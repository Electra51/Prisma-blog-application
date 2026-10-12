import { Request, Response } from "express";
import { PostStatus } from "../../../generated/prisma/enums";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
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
    res.status(400).json({
      error: "Post creation failed",
      details: err,
    });
  }
};

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
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;

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

export const PostController = {
  createPost,
  getAllPost,
};
