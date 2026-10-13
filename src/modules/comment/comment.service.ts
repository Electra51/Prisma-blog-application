import { prisma } from "../../lib/prisma";

//create post
const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  //post ache ki na test
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  //comment ache ki na
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

//get comment by id
const getCommentById = async (commentId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

//get comment by authorId
const getCommentByAuthorId = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};
//comment delete
//nijr comment delete korte parbe
//login thakte hobe
//nijer comment ki na check korte hobe
const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid");
  }
  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
};
