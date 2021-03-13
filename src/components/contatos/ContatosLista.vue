<template>
	<div>
		<h3 class="font-weight-light">Contatos</h3>

		<div class="form-group">
			<input
				type="search"
				class="form-control"
				placeholder="Buscar contatos"
				@keyup.enter="buscar"
				:value="busca"
			/>
		</div>

		<ul class="list-group" v-if="contatos.length > 0">
			<ContatosListaItem
				class="list-group-item"
				v-for="contato in contatosFiltrados"
				:key="contato.id"
				:contato="contato"
			/>
		</ul>
		<p v-else>Nenhum contato cadastrado</p>
		<button class="btn btn-secondary mt-4 mb-4" @click="$router.push('/')">Voltar</button>
	</div>
</template>

<script>
import ContatosListaItem from './ContatosListaItem';

export default {
	components: {
		ContatosListaItem,
	},
	props: ['busca'],
	data() {
		return {
			contatos: [
				{ id: 1, nome: 'Luiz Henrique', email: 'luizmartarelli@gmail.com' },
				{ id: 2, nome: 'Denise Ana', email: 'denise.ana@hotmail.com' },
				{ id: 3, nome: 'Luiz Gustavo', email: 'gustavo@hotmail.com' },
			],
		};
	},
	computed: {
		contatosFiltrados() {
			return !this.busca
				? this.contatos
				: this.contatos.filter(contato =>
						contato.nome.toLowerCase().includes(this.busca.toLowerCase())
				  );
		},
	},
	methods: {
		buscar(event) {
			this.$router.push({
				path: '/contatos',
				query: { busca: event.target.value },
			});
		},
	},
};
</script>
