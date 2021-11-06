import Vuex from 'vuex';
import Vue from 'vue';
import io from "socket.io-client";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        socket: io("/"),
        playerInfo: {
            roomId: "",
            playerId: "",
            name: "",
            chip: "",
            cardsInHand: [],
            moveInfo: { canPlayCard: false, canDrawFromDeck: false },
            score: 0,
        },
        chippedCards: {},
        cardsInSequence: [],
        otherPlayersInfo: [],
        mutableCardIds: [],
    },
    mutations: {
        setPlayerInfo(state, data) {
            state.playerInfo = {};
            state.playerInfo = data;
        },
        setChippedCards(state, data) {
            state.chippedCards = data;
        },
        setCardsInSequence(state, data) {
            state.cardsInSequence = data;
        },
        setOtherPlayersInfo(state, data) {
            state.otherPlayersInfo = [];
            state.otherPlayersInfo.push(data);
        },
    },
    actions: {

    },
    modules: {
    },
})