import type { Comment, Flavor, IceCreamLocation, User } from './types';

export const isComment = (comment: string | Comment): comment is Comment => {
  return (comment as Comment)._id !== undefined;
};

export const isCommentsList = (commentList: string[] | Comment[]): commentList is Comment[] => {
  return (commentList as Comment[])[0]._id !== undefined;
};

export const isIceCreamLocations = (
  list: IceCreamLocation[] | Flavor[] | string[]
): list is IceCreamLocation[] => {
  return (list as IceCreamLocation[])[0].name !== undefined;
};

export const isIceCreamLocation = (
  searchableItem: Flavor | IceCreamLocation | string
): searchableItem is IceCreamLocation => {
  return (searchableItem as IceCreamLocation).address !== undefined;
};

export const isFlavor = (
  searchableItem: Flavor | IceCreamLocation | string
): searchableItem is Flavor => {
  return (searchableItem as Flavor).color !== undefined;
};

export const isString = (
  possibleString: Flavor | IceCreamLocation | string | Pick<User, '_id' | 'name'>
): possibleString is string => {
  return typeof (possibleString as string) === 'string';
};

type ObjectWithIdAndNameProperty = { _id: string; name: string };

export const hasNameProperty = (
  objectOrString: ObjectWithIdAndNameProperty | string
): objectOrString is ObjectWithIdAndNameProperty => {
  return (objectOrString as ObjectWithIdAndNameProperty).name !== undefined;
};
