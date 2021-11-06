// import { createRouter, createWebHistory } from 'vue-router'
import Vue from 'vue';
import Router from 'vue-router';
import MainMenu from '../views/MainMenu.vue'
import GameRoom from '../views/GameRoom.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'MainMenu',
            component: MainMenu,
        },
        {
            path: '/gameRoom',
            name: 'GameRoom',
            component: GameRoom,
        }
    ]
})

// const routes = [
//     {
//         path: '/',
//         name: 'MainMenu',
//         component: MainMenu,
//     },
//     {
//         path: '/gameRoom',
//         name: 'GameRoom',
//         component: GameRoom,
//     }
// ]

// const router = createRouter({
//     history: createWebHistory(process.env.BASE_URL),
//     routes
// })

// export default router
