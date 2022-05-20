import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../types';

interface CommentStateSlice {
  comment: Comment;
}

const initialCommentState: CommentStateSlice = {
  comment: {
    _id: '',
    user_id: { _id: '', name: '' },
    location_id: '',
    flavors_referred: [
      {
        _id: '',
        name: '',
      },
    ],
    text: '',
    rating_vegan_offer: null,
    rating_quality: null,
    bio: false,
    vegan: false,
    lactose_free: false,
    not_specified: false,
    date: '',
  },
};

const commentSlice = createSlice({
  name: 'comment',
  initialState: initialCommentState,
  reducers: {
    setNewComment: (state, { payload }: PayloadAction<CommentStateSlice['comment']>) => {
      state.comment = payload;
    },
  },
});

export const commentActions = commentSlice.actions;
export const commentSliceReducer = commentSlice.reducer;
