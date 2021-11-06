import Vue from "vue";
import Vuex from "vuex";
// import io from 'socket.io-client';

Vue.use(Vuex)

// export default new Vuex.Store({
//     state: {
//         socket: io(),
//         roomId: "",
//     },
//     mutations: {
//         SET_ROOM_ID(state) {
//             state.roomId = 33;
//         }
//     },
//     actions: {

//     },
//     modules: {

//     }
// })

const state = {
    // socket: io(),
    foo: 0,
    roomId: "",
}

// currentSalaryOfUser: state => {  // this won't work in your example because store state is not being changed. The getter will only change when state.emps state changes. Just like a computed property in the vue instance.
//     var empIndex = findEmpIndex(data);
//     return state.emps[empIndex].salary; // you return the "altered" state (just the salary, instead of the whole state. If you are returning the whole state, it will be better to use mapState or this.$store.state to get the data.) which can be used in multiple cases if required, without duplication, as stated in the docs.
// }

const getters = {
    // allFoo(state) {
    //     console.log("In getters allFoo");
    //     return state.foo;
    // },
    allFoo: (state) => state.foo,
}

const actions = {
    async doFoo({ commit }, fooData) {
        commit("setFoo", fooData);
    },

}

// getEmployeeSalaries: async ({ commit }) => { // there should be an action like this that is dispatched from your template. This will probably be an asynchronous action that gets data from the database

//     const response = await databaseCallToFetchData; // wait for the data to be fetched from the database
//     const payload = response.data.data // get the payload from the database call
//     commit('getEmployeeSalaries', payload);
// }

const mutations = {
    setFoo: function (state, foo) {
        // console.log("Vuex. This is data: " + foo);
        state.foo = foo;
        console.log("From vuex this: " + state.foo);
    },
    // thisIsFoo: function (getters) {
    //     console.log("In mutation thisIsFoo");
    //     getters.allFoo;
    // }
    // SET_ROOM_ID(state) {
    //     console.log("setting up room id");
    //     state.roomId = 330;
    // }
}

export default {
    state,
    getters,
    actions,
    mutations
};