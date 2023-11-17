<script lang="ts">
	import { onMount } from 'svelte';
	import { differenceInHours, formatDistance, formatRelative, isToday } from 'date-fns';

	import { username, preferences } from '$lib/stores';
	import { toggleLastCompletedFormat } from '$lib/preferences';
	import { colorForBuffer } from '$lib/goals';

	import CheckmarkIcon from '$lib/checkmark-icon.svelte';
	import DataPair from '$lib/data-pair.svelte';
	import StatusChip from './status-chip.svelte';

	export let slug: string;
	export let title: string | null;
	export let goalType: string;
	export let safebuf: number;
	export let safebump: number;
	export let maxBuffer: number;
	export let pledge: number;
	export let baremin: string;
	export let losedate: number;
	export let lastday: number;
	export let rate: number;
	export let runits: string;
	export let gunits: string;
	export let fineprint: string | null;

	$: isBeemergency = safebuf === 0;
	$: lastdayDate = new Date(lastday * 1000);
	$: hasBeenDoneToday = isToday(lastdayDate);
	$: color = colorForBuffer(safebuf);
	$: noMaxBuffer = maxBuffer === null;
	$: maxBufferString = !noMaxBuffer ? `${maxBuffer}d` : 'None';

	// prettier-ignore
	const emojis = [
		'💪', '👂', '👀', '🧠', '🫁', '🫀',
		'📱', '📷', '⏰', '⏳', '💡', '🪫', '🖥️',
		'🪥', '🚰', '🛌', '📥', '📈', '✍️', '👨‍💻'
	]
	const emoji = emojis[Math.floor(Math.random() * emojis.length)];

	let minTotal: number | null = null;
	let timeLeft: number;
	let timeUnit: string;
	$: if (baremin || losedate) {
		if (goalType === 'biker') {
			minTotal = Math.ceil(safebump);
		}
		timeLeft = safebuf === 0 ? differenceInHours(new Date(losedate * 1000), new Date()) : safebuf;
		timeUnit = safebuf === 0 ? 'h' : 'd';
	}

	let noDescription = false;
	$: if (!title || title.length === 0) {
		title = 'No description given.';
		noDescription = true;
	} else {
		noDescription = false;
	}

	const convertRUnit = (runit: string) => {
		if (runit === 'd') {
			return 'day';
		} else if (runit === 'w') {
			return 'week';
		} else if (runit === 'm') {
			return 'month';
		} else if (runit === 'y') {
			return 'year';
		} else {
			return '?';
		}
	};

	let lastCompletedDateString: string;
	const updateLastCompletedDate = (date: Date) => {
		if ($preferences.lastCompletedFormat === 'relative') {
			const relativeDateRegex = /last\s[A-Z][a-z]+|(yesterday)|(today)/g;
			const lastDateString = formatRelative(date, new Date());
			const matches = lastDateString.match(relativeDateRegex);
			if (matches) {
				lastCompletedDateString = matches[0].split(' ')[1] ?? matches[0];
			} else {
				lastCompletedDateString = lastDateString; // It's more than a week ago / it's a calendar date.
			}
		} else if ($preferences.lastCompletedFormat === 'distance') {
			lastCompletedDateString = formatDistance(lastdayDate, new Date()) + ' ago';
		}
	};
	$: $preferences && updateLastCompletedDate(lastdayDate);

	onMount(() => {
		const updateInterval = setInterval(() => {
			hasBeenDoneToday = isToday(lastdayDate);
			updateLastCompletedDate(lastdayDate);
		}, 1000 * 3);
		return () => {
			clearInterval(updateInterval);
		};
	});
</script>

<div class="container {color}" class:done={hasBeenDoneToday && !isBeemergency}>
	<!-- <div class="emoji">
		<div class="emojiLabel">
			{emoji}
		</div>
	</div> -->
	<div class="topSection">
		<div class="name-status">
			<div class="name">
				<span><a href="https://www.beeminder.com/{$username}/{slug}">{slug}</a></span>
				<div class="checkmark"><CheckmarkIcon {color} /></div>
			</div>
			<StatusChip {color} {baremin} {minTotal} {timeLeft} {timeUnit} {pledge} />
		</div>
		{#if $preferences.showExtraData.description}
			<div class="description" class:noDescription>{title}</div>
		{/if}
	</div>
	<div class="additionalInfo">
		{#if $preferences.showExtraData.lastCompleted}
			<DataPair
				{color}
				key="Last completed"
				value={lastCompletedDateString}
				onClick={() => toggleLastCompletedFormat($preferences.lastCompletedFormat)}
			/>
		{/if}
		{#if $preferences.showExtraData.rate && rate}
			<DataPair
				{color}
				key="Rate"
				value="{rate % 1 !== 0 ? rate.toFixed(1) : rate} {gunits} per {convertRUnit(runits)}"
			/>
		{/if}
		{#if $preferences.showExtraData.maxBuffer && maxBuffer}
			<DataPair {color} key="Max buffer" value={maxBufferString} />
		{/if}
		{#if $preferences.showExtraData.finePrint && fineprint}
			<DataPair {color} key="Fine print" value={fineprint} />
		{/if}
	</div>
</div>

<style>
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: 0.375rem;
		padding: 1rem;
		background-color: #fff;
		transition: opacity 0.5s;
		min-width: 0;
	}
	.container.done {
		opacity: 45%;
	}
	.container.red {
		background-color: hsla(0, 100%, 97%, 1);
	}
	.container.orange {
		background-color: hsla(28, 100%, 96%, 1);
	}
	.container.yellow {
		background-color: hsla(52, 100%, 96%, 1);
	}
	.container.green {
		background-color: hsla(104, 100%, 98%, 1);
	}
	.container.blue {
		background-color: hsla(215, 100%, 98%, 1);
	}
	.container.purple {
		background-color: hsla(277, 100%, 98%, 1);
	}
	.topSection {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.name-status {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 0.375rem;
	}
	.nameContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		min-width: 0;
	}
	.name {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		padding-right: 2rem;
		max-width: calc(100% - 3rem);
	}
	.name span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: 'Nunito';
		font-size: 1rem;
		font-weight: 800;
		line-height: normal;
	}
	.red .name {
		color: hsla(0, 100%, 39%, 1);
	}
	.orange .name {
		color: hsla(28, 100%, 47%, 1);
	}
	.yellow .name {
		color: hsla(52, 100%, 33%, 1);
	}
	.green .name {
		color: hsla(104, 100%, 25%, 1);
	}
	.blue .name {
		color: hsla(209, 100%, 37%, 1);
	}
	.purple .name {
		color: hsla(276, 100%, 40%, 1);
	}
	.name a {
		color: inherit;
		text-decoration: none;
	}
	.emoji {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.5rem;
		cursor: pointer;
		border-radius: 0.25rem;
	}
	.emoji:hover {
		background-color: hsla(0, 0%, 100%, 0.85);
	}
	.emojiLabel {
		font-size: 1.5rem;
		line-height: 1.5rem;
		user-select: none;
		text-align: center;
	}
	.checkmark {
		display: none;
		height: 1rem;
		width: 1rem;
		flex-shrink: 0;
	}
	.done .checkmark {
		display: block;
	}
	.description {
		color: hsla(0, 0%, 43%, 1);
		font-family: Inter;
		font-size: 0.75rem;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}
	.additionalInfo {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}
</style>
