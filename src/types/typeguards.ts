import type { Comment, User } from './types';

export const isComment = (comment: string | Comment): comment is Comment => {
  return (comment as Comment)._id !== undefined;
};

export const isCommentsList = (commentList: string[] | Comment[]): commentList is Comment[] => {
  return (commentList as Comment[])[0]._id !== undefined;
};

export const isString = (
  possibleString: string | Pick<User, '_id' | 'name'>
): possibleString is string => {
  return typeof (possibleString as string) === 'string';
};

type ObjectWithIdAndNameProperty = { _id: string; name: string };

export const hasNameProperty = (
  objectOrString: ObjectWithIdAndNameProperty | string
): objectOrString is ObjectWithIdAndNameProperty => {
  return (objectOrString as ObjectWithIdAndNameProperty).name !== undefined;
};
