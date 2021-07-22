/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: '',
    players: {}
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        addId(state, action) {
            state.id = action.payload;
        },
        removeId(state) {
            state.id = '';
        },
        addPlayer(state, action) {
            state.players[action.payload.id] = action.payload;
        },
        addPlayers(state, action) {
            action.payload.forEach((el) => {
                state.players[el.id] = el;
            });
        },
        removePlayer(state, action) {
            delete state.players[action.payload];
        },
        removeAllPlayers(state) {
            state.players = {};
        }
    }
});

export const {
    addId,
    removeId,
    addPlayer,
    addPlayers,
    removePlayer,
    removeAllPlayers
} = gameSlice.actions;

export default gameSlice.reducer;
