import { Request, Response } from "express";
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

    const result = await postService.getAllPost({ search: searchString, tags });

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
