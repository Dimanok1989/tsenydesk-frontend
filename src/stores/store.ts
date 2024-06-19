import { configureStore } from '@reduxjs/toolkit'
import darkModeReducer from './darkModeSlice'
import leads from './leads';
import fields from './fields';

export const store = configureStore({
  reducer: {
    leads,
    fields,
    // darkMode: darkModeReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
