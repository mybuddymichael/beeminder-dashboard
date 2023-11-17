<script lang="ts">
	import type { GoalColor } from './goals';

	export let color: GoalColor;
	export let baremin: string;
	export let minTotal: number | null = null;
	export let timeLeft: number;
	export let timeUnit: string;
	export let pledge: number;
</script>

<div class="status {color}">
	{baremin}
	{#if minTotal}
		<span class="mintotal">({minTotal})</span>
	{/if}
	in {timeLeft}{timeUnit}
	{#if timeUnit === 'h'}
		<span class="dot">•</span> ${pledge}
	{/if}
</div>

<style>
	.status {
		padding: 0.125rem 0.3125rem;
		border-radius: 0.25rem;
		background: #eee;
		font-size: 0.75rem;
		font-weight: 700;
		line-height: normal;
	}
	.status.red {
		color: hsla(0, 100%, 95%, 1);
		background: linear-gradient(134deg, hsla(0, 100%, 75%, 1), hsla(0, 100%, 43%, 1));
	}
	.status.orange {
		color: hsla(28, 100%, 28%, 1);
		background: linear-gradient(137deg, hsl(43, 100%, 75%) 0%, hsl(25, 100%, 59%) 100%);
	}
	.status.yellow {
		color: hsla(52, 100%, 27%, 1);
		background: linear-gradient(137deg, hsla(60, 100%, 72%, 1), hsla(50, 100%, 49%, 1));
	}
	.status.green {
		color: hsla(104, 100%, 20%, 1);
		background: linear-gradient(137deg, #cfffbe 0%, #a0dc8a 100%);
	}
	.status.blue {
		color: hsla(209, 100%, 33%, 1);
		background: linear-gradient(137deg, hsl(216 100% 50% / 30%) 0%, hsla(223 100% 33% / 30%) 100%);
	}
	.status.purple {
		color: hsla(276, 100%, 40%, 1);
		background: linear-gradient(137deg, hsla(277, 100%, 88%, 1), hsla(276, 100%, 76%, 1));
	}
	.mintotal,
	.dot {
		opacity: 0.6;
	}
</style>
