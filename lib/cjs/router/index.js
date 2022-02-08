"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const vue_router_1 = __importDefault(require("vue-router"));
const Home_vue_1 = __importDefault(require("../views/Home.vue"));
const About_vue_1 = __importDefault(require("../views/About.vue"));
vue_1.default.use(vue_router_1.default);
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home_vue_1.default,
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: About_vue_1.default,
    },
];
const router = new vue_router_1.default({
    routes,
});
exports.default = router;
//# sourceMappingURL=index.js.map