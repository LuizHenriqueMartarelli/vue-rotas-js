import Vue from 'vue';
import VueRouter from 'vue-router';
import Erro404Contatos from '../views/contatos/Erro404Contatos.vue';
import Erro404 from '../views/Erro404.vue';
import Login from '../views/login/Login.vue';

import EventBus from '../event-bus';
const Contatos = () => import(/* webpackChunkName: "contatos" */ '../views/contatos/Contatos.vue');
const ContatosHome = () =>
	import(/* webpackChunkName: "contatos" */ '../views/contatos/ContatosHome.vue');
const ContatoDetalhes = () =>
	import(/* webpackChunkName: "contatos" */ '../views/contatos/ContatoDetalhes.vue');
const ContatoEditar = () =>
	import(/* webpackChunkName: "contatos" */ '../views/contatos/ContatoEditar.vue');
const Home = () => import('../views/Home.vue');

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	linkActiveClass: 'active',
	scrollBehavior(to, from, savedPosition) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (savedPosition) return resolve(savedPosition);
				if (to.hash) {
					return resolve({
						selector: to.hash,
					});
				}
				resolve({ x: 0, y: 0 });
			}, 3000);
		});
	},
	routes: [
		{
			path: '/contatos',
			component: Contatos,
			name: 'contatos',
			props: route => {
				const busca = route.query.busca;
				return busca ? { busca } : {};
			},
			children: [
				{
					path: ':id',
					component: ContatoDetalhes,
					name: 'contato',
					props: route => ({
						id: Number(route.params.id),
					}),
					beforeEnter(to, from, next) {
						console.log(to);
						next();
					},
				},
				{
					path: ':id(\\d+)/editar',
					meta: { requerAutenticao: true },
					beforeEnter(to, from, next) {
						console.log(to);
						next();
					},
					components: {
						default: ContatoEditar,
						'contato-detalhes': ContatoDetalhes,
					},
					props: {
						default: true,
						'contato-detalhes': route => ({
							id: Number(route.params.id),
						}),
					},
				},
				{ path: '', component: ContatosHome, name: 'contatos' },
				{ path: '*', component: Erro404Contatos },
			],
		},
		{ path: '/home', component: Home },
		{ path: '/login', component: Login },
		{
			path: '/',
			redirect: to => {
				console.log(to);
				return { name: 'home' };
			},
		},
		{ path: '*', component: Erro404 },
	],
});

router.beforeEach((to, from, next) => {
	const estaAutenticado = EventBus.autenticado;
	if (to.matched.some(rota => rota.meta.requerAutenticao)) {
		if (!estaAutenticado) {
			next({ path: '/login', query: { redirecionar: to.fullPath } });
			return;
		}
	}
	next();
});

export default router;
