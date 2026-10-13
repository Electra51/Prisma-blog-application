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

export const commentService = {
  createComment,
};
