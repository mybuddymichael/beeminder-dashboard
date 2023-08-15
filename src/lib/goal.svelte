<script lang="ts">
	import { differenceInHours } from 'date-fns';
	import { username } from './stores';

	export let slug: string;
	export let title: string;
	export let safebuf: number;
	export let pledge: number;
	export let baremin: string;
	export let losedate: number;

	let noDescription = false;
	let statusText: string;
	let chipClass: string;
	$: pledgeText = `$${pledge}`;

	$: if (!title || title.length === 0) {
		title = 'No description given.';
		noDescription = true;
	} else {
		noDescription = false;
	}

	$: if (safebuf > 0) {
		const dayLabel = safebuf === 1 ? 'day' : 'days';
		statusText = `${safebuf} ${dayLabel}`;
	} else {
		const hours = differenceInHours(new Date(losedate * 1000), new Date());
		statusText = `${baremin} due in ${hours}hrs`;
	}

	$: if (safebuf === 0) {
		chipClass = 'zero';
	} else if (safebuf === 1) {
		chipClass = 'one';
	} else if (safebuf === 2) {
		chipClass = 'two';
	} else if (safebuf >= 3 && safebuf < 7) {
		chipClass = 'three';
	} else if (safebuf >= 7) {
		chipClass = 'blue';
	}
</script>

<div class="container">
	<div class="name-status">
		<div class="name"><a href="https://www.beeminder.com/{$username}/{slug}">{slug}</a></div>
		<div class="status {chipClass}">
			{statusText}
			{#if safebuf === 0}
				<span class="dot"> • </span>{pledgeText}
			{/if}
		</div>
	</div>
	<div class="description" class:noDescription>{title}</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background-color: #fff;
		border-radius: 0.375rem;
		border: 1px solid #f2f2f2;
		padding: 1rem;
	}
	.name-status {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.name {
		font-size: 0.875rem;
		font-weight: 700;
	}
	.name a {
		color: inherit;
		text-decoration: none;
	}
	.status {
		padding: 0.125rem 0.3125rem;
		font-size: 0.6875rem;
		font-weight: 500;
		line-height: normal;
		border-radius: 0.25rem;
		background: #eee;
	}
	.status.zero {
		color: #fff;
		background: linear-gradient(145deg, #ff3232 0%, #8e0000 100%);
	}
	.status.one {
		color: #000;
		background: linear-gradient(137deg, #ffdc81 0%, #ff862e 100%);
	}
	.status.two {
		color: #000;
		background: linear-gradient(137deg, #ffdc81 0%, #ff862e 100%);
	}
	.status.three {
		color: #000;
		background: linear-gradient(137deg, #cfffbe 0%, #a0dc8a 100%);
	}
	.status.blue {
		color: #000;
		background: linear-gradient(137deg, hsl(216 100% 50% / 30%) 0%, hsla(223 100% 33% / 30%) 100%);
	}
	.dot {
		opacity: 0.5;
	}
	.description {
		color: #848484;
		font-family: Inter;
		font-size: 0.6875rem;
		font-style: normal;
		font-weight: 450;
		line-height: normal;
	}
	.noDescription {
		color: #cccccc;
		font-style: italic;
	}
</style>
