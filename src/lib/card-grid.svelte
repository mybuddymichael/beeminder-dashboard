<script lang="ts">
	import type { GoalClean } from '$lib/goals';
	import { flip } from 'svelte/animate';
	import GoalCard from '$lib/goal.svelte';
	import { fade } from 'svelte/transition';

	export let goals: GoalClean[];
</script>

<div class="cards" transition:fade={{ duration: 100 }}>
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
		grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
		padding: 1.25rem;
		gap: 0.5rem;
	}
	@media screen and (min-width: 600px) {
		.cards {
			--columns: 2;
		}
	}
	@media screen and (min-width: 850px) {
		.cards {
			--columns: 3;
		}
	}
	@media screen and (min-width: 1100px) {
		.cards {
			--columns: 4;
		}
	}
	@media screen and (min-width: 1350px) {
		.cards {
			--columns: 5;
		}
	}
	@media screen and (min-width: 1600px) {
		.cards {
			--columns: 6;
		}
	}
	@media screen and (min-width: 1850px) {
		.cards {
			--columns: 7;
		}
	}
	@media screen and (min-width: 2100px) {
		.cards {
			--columns: 8;
		}
	}
	@media screen and (min-width: 2350px) {
		.cards {
			--columns: 9;
		}
	}
	@media screen and (min-width: 2600px) {
		.cards {
			--columns: 10;
		}
	}
	@media screen and (min-width: 2850px) {
		.cards {
			--columns: 11;
		}
	}
	@media screen and (min-width: 3100px) {
		.cards {
			--columns: 12;
		}
	}
	@media screen and (min-width: 3350px) {
		.cards {
			--columns: 13;
		}
	}
</style>
