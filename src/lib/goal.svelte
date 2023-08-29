<script lang="ts">
	import { differenceInHours, formatRelative, isToday } from 'date-fns';
	import { username } from './stores';
	import CheckmarkIcon from './checkmark-icon.svelte';
	import { onMount } from 'svelte';

	export let slug: string;
	export let title: string;
	export let safebuf: number;
	export let pledge: number;
	export let baremin: string;
	export let losedate: number;
	export let lastday: number;
	export let rate: number;
	export let runits: string;
	export let gunits: string;

	const relativeDateRegex = /last\s[A-Z][a-z]+|(yesterday)|(today)/g;

	$: isBeemergency = safebuf === 0;
	$: lastdayDate = new Date(lastday * 1000);
	$: hasBeenDoneToday = isToday(lastdayDate);
	$: pledgeText = `$${pledge}`;

	$: lastDateString = formatRelative(lastdayDate, new Date());
	$: matches = lastDateString.match(relativeDateRegex);
	let relativeDate: string;
	const updateRelativeDate = (matches: RegExpMatchArray | null) => {
		if (matches) {
			relativeDate = matches[0].split(' ')[1] ?? matches[0];
		} else {
			relativeDate = lastDateString;
		}
	};
	$: updateRelativeDate(matches);
	let noDescription = false;
	let statusText: string;
	let chipClass: string;

	$: if (!title || title.length === 0) {
		title = 'No description given.';
		noDescription = true;
	} else {
		noDescription = false;
	}

	const updateBeemergencyStatusText = () => {
		const hours = differenceInHours(new Date(losedate * 1000), new Date());
		statusText = `${baremin} due in ${hours}hrs`;
	};
	$: if (isBeemergency) {
		updateBeemergencyStatusText();
	} else {
		const dayLabel = safebuf === 1 ? 'day' : 'days';
		statusText = `${safebuf} ${dayLabel}`;
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

	onMount(() => {
		const updateInterval = setInterval(() => {
			if (isBeemergency) {
				updateBeemergencyStatusText();
			}
			hasBeenDoneToday = isToday(lastdayDate);
		}, 1000 * 3);
		return () => {
			clearInterval(updateInterval);
		};
	});
</script>

<div class="container" class:done={hasBeenDoneToday}>
	<div class="topSection">
		<div class="name-status">
			<div class="name">
				<a href="https://www.beeminder.com/{$username}/{slug}">{slug}</a>
				{#if hasBeenDoneToday}
					<div class="checkmark"><CheckmarkIcon /></div>
				{/if}
			</div>
			<div class="status {chipClass}">
				{statusText}
				{#if safebuf === 0}
					<span class="dot"> • </span>{pledgeText}
				{/if}
			</div>
		</div>
		<div class="description" class:noDescription>{title}</div>
	</div>
	<div class="additionalInfo">
		<div class="key">Last completed</div>
		<div class="value relativeDate">{relativeDate}</div>
		<div class="key">Rate</div>
		<div class="value">{rate % 1 !== 0 ? rate.toFixed(2) : rate} {gunits} / {runits}</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 0.375rem;
		border: 1px solid #f2f2f2;
		transition: opacity 0.5s;
	}
	.container.done {
		opacity: 45%;
	}
	.topSection {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
	}
	.name-status {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.name {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
	}
	.name a {
		color: inherit;
		text-decoration: none;
	}
	.checkmark {
		height: 0.75rem;
		width: 0.75rem;
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
	.additionalInfo {
		display: grid;
		grid-template-columns: max-content 1fr;
	}
	.key,
	.value {
		border-top: 1px solid #f0f0f0;
	}
	.key {
		/* background-color: hsl(0 0% 98% / 100%); */
		border-right: 1px solid #f2f2f2;
		padding: 0.625rem 1rem;
		color: #848484;
		font-size: 0.625rem;
		font-style: normal;
		font-weight: 850;
		line-height: normal;
		text-transform: uppercase;
	}
	.value {
		display: flex;
		align-items: center;
		padding-left: 0.75rem;
		color: #848484;
		font-size: 0.6875rem;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}
	.relativeDate {
		text-transform: capitalize;
	}
</style>
