import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment } from '../../types/types';
import { convertIntoNumberFrom0To5 } from '../../utils/variables-and-functions';

type NewComment = Omit<Comment, '_id' | 'user_id' | 'location_id' | 'flavors_referred'>;

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
            date: newCommentData.date || new Date().toISOString(),
          },
          credentials: 'include',
        }),
      }),
    };
  },
});

export const { useAddCommentMutation } = commentApi;

