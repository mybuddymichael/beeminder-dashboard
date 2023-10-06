<script lang="ts">
	import type { GoalClean } from '$lib/goals';
	import { flip } from 'svelte/animate';
	import GoalCard from '$lib/goal.svelte';

	export let goals: GoalClean[];
</script>

<div class="cards">
	{#each goals as goal (goal.id)}
		<div animate:flip={{ duration: 300 }}>
			<GoalCard {...goal} />
		</div>
	{/each}
</div>

<style>
	.cards {
		--columns: 1;
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		padding: 1.25rem;
		gap: 1.25rem;
	}
	@media screen and (min-width: 620px) {
		.cards {
			--columns: 2;
		}
	}
	@media screen and (min-width: 900px) {
		.cards {
			--columns: 3;
		}
	}
	@media screen and (min-width: 1200px) {
		.cards {
			--columns: 4;
		}
	}
	@media screen and (min-width: 1500px) {
		.cards {
			--columns: 5;
		}
	}
	@media screen and (min-width: 1800px) {
		.cards {
			--columns: 6;
		}
	}
	@media screen and (min-width: 2100px) {
		.cards {
			--columns: 7;
		}
	}
	@media screen and (min-width: 2400px) {
		.cards {
			--columns: 8;
		}
	}
</style>
