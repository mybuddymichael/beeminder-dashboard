<script lang="ts">
	import { onMount } from 'svelte';
	import { differenceInHours, formatDistance, formatRelative, isToday } from 'date-fns';
	import emojiRegex from 'emoji-regex';

	import { betaFeatures, emoji as emojiStore, username, preferences } from '$lib/stores';
	import { toggleLastCompletedFormat } from '$lib/preferences';
	import { colorForBuffer } from '$lib/goals';

	import CheckmarkIcon from '$lib/checkmark-icon.svelte';
	import DataPair from '$lib/data-pair.svelte';
	import { updateEmoji } from '$lib/emoji';
	import Popover from './popover.svelte';
	import StatusChip from './status-chip.svelte';
	import { fade } from 'svelte/transition';

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
	export let compact = false;

	$: isDaily = fineprint?.includes('#daily');

	$: isBeemergency = safebuf === 0;
	$: lastdayDate = new Date(lastday * 1000);
	$: hasBeenDoneToday = isToday(lastdayDate);
	$: color = colorForBuffer(safebuf);
	$: noMaxBuffer = maxBuffer === null;
	$: maxBufferString = !noMaxBuffer ? `${maxBuffer}d` : 'None';
	$: canDisplayAsDone = hasBeenDoneToday && !isBeemergency && !emojiPopoverIsOpen && isDaily;

	let emojiInput = '';
	const emojiRegexPattern = emojiRegex();
	$: if (emojiInput) {
		if (!emojiRegexPattern.test(emojiInput)) {
			emojiInput = '';
		} else {
			updateEmoji(emojiInput, slug);
		}
	}

	// prettier-ignore
	const emojis = [
		'💪', '👂', '👀', '🧠', '🫁', '🫀',
		'📱', '📷', '⏰', '⏳', '💡', '🪫', '🖥️',
		'🪥', '🚰', '🛌', '📥', '📈', '✍️', '👨‍💻'
	]
	const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
	let isRandom = false;
	let thisEmoji: string;
	$: existingEmoji = $emojiStore.find((e) => e.goal === slug);
	$: if (existingEmoji) {
		thisEmoji = existingEmoji.emoji;
		isRandom = false;
	} else {
		thisEmoji = randomEmoji;
		isRandom = true;
	}
	let emojiPopoverIsOpen = false;

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

{#if compact}
	<div
		on:click|stopPropagation={(e) =>
			(window.location.href = `https://www.beeminder.com/${$username}/${slug}`)}
		on:keypress|stopPropagation={(e) =>
			(window.location.href = `https://www.beeminder.com/${$username}/${slug}`)}
		role="button"
		tabindex="0"
		class="mh-shadow-3 mh-highlight hover:mh-shadow-4 tw-relative tw-flex tw-cursor-pointer tw-select-none tw-flex-col tw-items-start tw-rounded-xl tw-bg-[#fbfbfb] tw-pb-[14px] tw-pl-[14px] tw-pr-2 tw-pt-1 {!$betaFeatures.useEmoji &&
			'tw-gap-2 tw-pt-3'} tw-transition tw-duration-300 hover:tw-opacity-100"
		class:tw-opacity-40={canDisplayAsDone}
	>
		<div class="tw-flex tw-w-full tw-flex-row tw-items-center tw-justify-between">
			<div
				class="tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-py-0 tw-pr-2 tw-font-[Nunito] tw-text-sm tw-font-bold tw-text-gray-700"
			>
				{slug}
			</div>
			{#if $betaFeatures.useEmoji}
				<Popover bind:isOpen={emojiPopoverIsOpen} padding="1rem">
					<div
						class="tw-flex tw-select-none tw-items-center tw-justify-center tw-p-2 tw-text-center tw-text-lg tw-leading-5"
						class:isRandom
						slot="button"
					>
						<span>{thisEmoji}</span>
					</div>
					<div class="popoverContents" slot="contents">
						<input
							bind:value={emojiInput}
							class="emojiInput"
							type="text"
							placeholder={thisEmoji ?? randomEmoji}
						/>
					</div>
				</Popover>
			{/if}
		</div>
		<StatusChip
			{color}
			{baremin}
			{minTotal}
			{timeLeft}
			{timeUnit}
			{pledge}
			checkMark={canDisplayAsDone}
		/>
	</div>
{:else}
	<div
		class="container {color}"
		class:done={hasBeenDoneToday && !isBeemergency}
		class:emojiPopoverIsOpen
	>
		{#if $betaFeatures.useEmoji}
			<div class="emojiButtonContainer">
				<Popover bind:isOpen={emojiPopoverIsOpen}>
					<div class="emojiButton" class:isRandom slot="button">
						<span>{thisEmoji}</span>
					</div>
					<div class="popoverContents" slot="contents">
						<input
							bind:value={emojiInput}
							class="emojiInput"
							type="text"
							placeholder={thisEmoji ?? randomEmoji}
						/>
					</div>
				</Popover>
			</div>
		{/if}
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
{/if}

<style>
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: 0.375rem;
		padding: 1rem;
		background-color: #fff;
		transition: opacity 0.175s;
		min-width: 0;
	}
	.container.done {
		opacity: 45%;
	}
	.container:hover,
	.container.emojiPopoverIsOpen {
		opacity: 100%;
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
		align-items: flex-start;
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
	.emojiButtonContainer {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
	}
	.emojiButton {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.5rem;
		font-size: 1.5rem;
		line-height: 1.5rem;
		user-select: none;
		text-align: center;
	}
	.isRandom span {
		opacity: 50%;
		filter: grayscale(100%);
	}
	.popoverContents {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.emojiInput {
		font-size: 1.5rem;
		width: 2rem;
		text-align: center;
		padding: 0.5rem;
		border: none;
		outline: none;
	}
	.emojiInput::placeholder {
		filter: saturate(0);
	}
	.emojiInput:focus::placeholder {
		color: transparent;
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
