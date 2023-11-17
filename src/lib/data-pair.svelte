<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import type { GoalColor } from '$lib/goals';

	export let color: GoalColor;
	export let key: string;
	export let value: string;
	export let onClick: EventHandler | null = null;
</script>

<div class="dataPair {color}">
	<div class="key">{key}</div>
	{#if onClick}
		<div
			class="value clickable"
			role="button"
			tabindex="0"
			on:click={onClick}
			on:keypress={onClick}
		>
			{value}
		</div>
	{:else}
		<div class="value">{value}</div>
	{/if}
</div>

<style>
	.dataPair {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}
	.dataPair:first-child {
		margin-top: 1.25rem;
	}
	.key {
		font-size: 0.675rem;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
	}
	.red .key {
		color: hsla(0, 100%, 86%, 1);
	}
	.orange .key {
		color: hsla(28, 100%, 76%, 1);
	}
	.yellow .key {
		color: hsla(52, 100%, 47%, 1);
	}
	.green .key {
		color: hsla(104, 47%, 66%, 1);
	}
	.blue .key {
		color: hsla(209, 62%, 75%, 1);
	}
	.purple .key {
		color: hsla(276, 100%, 83%, 1);
	}
	.value {
		color: hsla(0, 0%, 43%, 1);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: normal;
		width: fit-content;
	}
	.clickable {
		border-bottom: 1px solid hsl(0 0% 52% / 15%);
		cursor: pointer;
		user-select: none;
	}
	.clickable::first-letter {
		text-transform: capitalize;
	}
</style>
