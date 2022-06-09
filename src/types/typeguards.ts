import type { Comment } from './types';

export const isComment = (comment: string | Comment): comment is Comment => {
  return (comment as Comment)._id !== undefined;
};

export const isCommentsList = (commentList: string[] | Comment[]): commentList is Comment[] => {
  return (commentList as Comment[])[0]._id !== undefined;
};
