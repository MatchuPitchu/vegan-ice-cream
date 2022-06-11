import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { convertIntoNumberFrom0To5 } from '../../pages/Bewerten';
import { Comment } from '../../types/types';

type NewComment = Pick<
  Comment,
  | 'text'
  | 'rating_quality'
  | 'rating_vegan_offer'
  | 'bio'
  | 'vegan'
  | 'lactose_free'
  | 'not_specified'
  | 'date'
>;

// Define a service using a base URL and expected endpoints
export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/comments`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('token', token);
      }
      return headers;
    },
  }),
  tagTypes: ['Comment'], // define tag(s) which can trigger an action
  endpoints: (builder) => {
    return {
      addComment: builder.mutation<
        Comment,
        {
          location_id: string;
          user_id: string;
          newCommentData: NewComment;
        }
      >({
        query: ({ location_id, user_id, newCommentData }) => ({
          url: `/${location_id}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            user_id,
            text: newCommentData.text,
            rating_quality: convertIntoNumberFrom0To5(newCommentData.rating_quality as number),
            rating_vegan_offer: convertIntoNumberFrom0To5(
              newCommentData.rating_vegan_offer as number
            ),
            bio: newCommentData.bio,
            vegan: newCommentData.vegan,
            lactose_free: newCommentData.lactose_free,
            not_specified: newCommentData.not_specified,
            date: newCommentData.date,
          },
          credentials: 'include',
        }),
      }),
    };
  },
});

export const { useAddCommentMutation } = commentApi;
