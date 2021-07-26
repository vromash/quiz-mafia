/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: '',
    roomId: '',
    inGame: false,
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
        updateInGameStatus(state, action) {
            state.inGame = action.payload;
        },
        updateGameData(state, action) {
            state.inGame = action.payload.inGame;
            state.id = action.payload.gameId;
            state.roomId = action.payload.roomId;
        },
        resetGameData(state, action) {
            state.inGame = initialState.inGame;
            state.id = initialState.gameId;
            state.roomId = initialState.roomId;
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
    updateInGameStatus,
    updateGameData,
    resetGameData,
    addPlayer,
    addPlayers,
    removePlayer,
    removeAllPlayers
} = gameSlice.actions;

export default gameSlice.reducer;
