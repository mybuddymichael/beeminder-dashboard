<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	type DatePresentationOption = 'relative' | 'distance';
	const datePresentationOption = writable('distance' as DatePresentationOption);
</script>

<script lang="ts">
	import { differenceInHours, formatDistance, formatRelative, isToday } from 'date-fns';
	import { username } from './stores';
	import CheckmarkIcon from './checkmark-icon.svelte';
	import { onMount } from 'svelte';

	export let slug: string;
	export let title: string | null;
	export let safebuf: number;
	export let pledge: number;
	export let baremin: string;
	export let losedate: number;
	export let lastday: number;
	export let rate: number;
	export let runits: string;
	export let gunits: string;
	export let fineprint: string | null;

	$: isBook = fineprint && fineprint.match(/#book/);
	$: isBeemergency = safebuf === 0;
	$: lastdayDate = new Date(lastday * 1000);
	$: hasBeenDoneToday = isToday(lastdayDate);
	$: pledgeText = `$${pledge}`;

	const toggleDatePresentationOption = () => {
		const newOption = $datePresentationOption === 'relative' ? 'distance' : 'relative';
		datePresentationOption.set(newOption);
	};
	let lastCompletedDateString: string;

	const updateLastCompletedDate = (date: Date, option: DatePresentationOption) => {
		if (option === 'relative') {
			const relativeDateRegex = /last\s[A-Z][a-z]+|(yesterday)|(today)/g;
			const lastDateString = formatRelative(date, new Date());
			const matches = lastDateString.match(relativeDateRegex);
			if (matches) {
				lastCompletedDateString = matches[0].split(' ')[1] ?? matches[0];
			} else {
				lastCompletedDateString = lastDateString; // It's more than a week ago / it's a calendar date.
			}
		} else if (option === 'distance') {
			lastCompletedDateString = formatDistance(lastdayDate, new Date()) + ' ago';
		}
	};
	$: updateLastCompletedDate(lastdayDate, $datePresentationOption);

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
			updateLastCompletedDate(lastdayDate, $datePresentationOption);
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
		<div class="value lastCompletedDate">
			<p
				role="button"
				tabindex="0"
				on:click={toggleDatePresentationOption}
				on:keypress={toggleDatePresentationOption}
			>
				{lastCompletedDateString}
			</p>
		</div>
		<div class="key">Rate</div>
		<div class="value">{rate % 1 !== 0 ? rate.toFixed(2) : rate} {gunits} / {runits}</div>
		<div class="key">Fine Print</div>
		{#if fineprint && !isBook}
			<div class="value">{fineprint}</div>
		{:else if isBook}
			<div class="value noFinePrint">This goal is a book.</div>
		{:else}
			<div class="value noFinePrint">No fine print for this goal.</div>
		{/if}
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
		background: linear-gradient(137deg, hsla(60, 100%, 72%, 1), hsla(50, 100%, 70%, 1));
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
		padding: 0.625rem 1rem;
	}
	.key {
		/* background-color: hsl(0 0% 98% / 100%); */
		border-right: 1px solid #f2f2f2;
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
		color: hsl(0, 0%, 52%);
		font-size: 0.6875rem;
		font-style: normal;
		font-weight: 500;
	}
	.lastCompletedDate p {
		border-bottom: 1px solid hsl(0 0% 52% / 15%);
		cursor: pointer;
	}
	.lastCompletedDate p::first-letter {
		text-transform: capitalize;
	}
	.key,
	.value {
		line-height: 1.4em;
	}
	.noFinePrint {
		color: #cccccc;
		font-style: italic;
	}
</style>
