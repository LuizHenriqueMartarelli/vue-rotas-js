import Vue from 'vue';
import VueRouter from 'vue-router';
import Contatos from '../views/contatos/Contatos.vue';
import ContatosHome from '../views/contatos/ContatosHome.vue';
import ContatoDetalhes from '../views/contatos/ContatoDetalhes.vue';
import ContatoEditar from '../views/contatos/ContatoEditar.vue';
import Erro404Contatos from '../views/contatos/Erro404Contatos.vue';
import Home from '../views/Home.vue';
import Erro404 from '../views/Erro404.vue';
import Login from '../views/login/Login.vue';

import EventBus from '../event-bus';

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	linkActiveClass: 'active',
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
				return { name: 'contatos' };
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
