/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: '',
    userId: ''
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        addId(state, action) {
            state.id = action.payload;
        },
        addUserId(state, action) {
            state.userId = action.payload;
        }
    }
});

export const { addId, addUserId } = sessionSlice.actions;

export default sessionSlice.reducer;
