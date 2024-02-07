<script lang="ts">
	import { onMount } from 'svelte';
	import { addDays, format } from 'date-fns';

	import { signOut } from './auth';
	import { betaFeatures, popoverIsOpen, preferences } from '$lib/stores';
	import { fetchJson, fetchGoals } from '$lib/api';
	import { GroupByOption, groupGoals, mostPressingColor } from '$lib/goals';
	import { latestVersion } from '$lib/versions';
	import type { GoalClean, GoalGroup } from '$lib/goals';

	import { Layout, setGroupByOption, toggleLayout, toggleShowExtraData } from './preferences';

	import BeeIcon from '$lib/bee-icon.svelte';
	import CardGrid from '$lib/card-grid.svelte';
	import Popover from '$lib/popover.svelte';
	import PrefOption from '$lib/pref-option.svelte';
	import SettingsIcon from '$lib/settings-icon.svelte';
	import Goal from './goal.svelte';
	import { fade } from 'svelte/transition';

	const versionObj = latestVersion();
	const VERSION = versionObj.version;
	const DATE = versionObj.date;
	const DESCRIPTION = versionObj.description;

	let today = new Date();

	// Used to dynamically change the favicon.
	$: keyColor = mostPressingColor(allGoals);

	$: layoutIsTimeline = $preferences.layout === Layout.timeline;

	$: groupByDone = $preferences.groupBy === GroupByOption.done;
	const toggleGroupByDone = (e: Event) => {
		groupByDone = !groupByDone;
	};
	$: if (groupByDone) {
		setGroupByOption(GroupByOption.done);
	} else {
		setGroupByOption(GroupByOption.ungrouped);
	}

	let allGoals: GoalClean[] = [];
	let goalsGrouped: GoalGroup;

	$: if ($preferences) {
		goalsGrouped = groupGoals(allGoals, $preferences.groupBy);
	}

	const updateGoals = async () => {
		const updatedGoals = await fetchGoals(VERSION);
		if (updatedGoals) {
			allGoals = updatedGoals;
			groupGoals(allGoals, $preferences.groupBy);
		}
	};

	function closePopovers(_: Event) {
		popoverIsOpen.set(false);
	}

	onMount(function () {
		try {
			allGoals = JSON.parse(localStorage.getItem('goals') || '');
			groupGoals(allGoals, $preferences.groupBy);
		} catch {}
		updateGoals();
		const updateInterval = setInterval(async () => {
			updateGoals();
			today = new Date();
			if ((await fetchJson('/version')) !== VERSION) {
				location.reload();
			}
		}, 1000 * 30); // 30 seconds.
		// Refresh the data when the tab or window regains focus.
		window.addEventListener('focus', updateGoals);
		document.addEventListener('click', closePopovers);
		// Clean up on component unmount.
		return () => {
			clearInterval(updateInterval);
			window.removeEventListener('focus', updateGoals);
			document.removeEventListener('click', closePopovers);
		};
	});

	const boardNumbers = Array.from({ length: 15 }, (_, i) => i);

	type ColorMapping = {
		[key: number]: string;
	};
	const bgMappings: ColorMapping = {
		0: 'tw-bg-red-50',
		1: 'tw-bg-orange-50',
		2: 'tw-bg-yellow-50',
		3: 'tw-bg-green-50',
		4: 'tw-bg-green-50',
		5: 'tw-bg-green-50',
		6: 'tw-bg-green-50',
		7: 'tw-bg-sky-50',
		8: 'tw-bg-sky-50',
		9: 'tw-bg-sky-50',
		10: 'tw-bg-sky-50',
		11: 'tw-bg-sky-50',
		12: 'tw-bg-sky-50',
		13: 'tw-bg-sky-50',
		14: 'tw-bg-purple-50'
	};
	const textColorMappings: ColorMapping = {
		0: 'tw-text-red-700',
		1: 'tw-text-orange-700',
		2: 'tw-text-yellow-700',
		3: 'tw-text-green-700',
		4: 'tw-text-green-700',
		5: 'tw-text-green-700',
		6: 'tw-text-green-700',
		7: 'tw-text-sky-700',
		8: 'tw-text-sky-700',
		9: 'tw-text-sky-700',
		10: 'tw-text-sky-700',
		11: 'tw-text-sky-700',
		12: 'tw-text-sky-700',
		13: 'tw-text-sky-700',
		14: 'tw-text-purple-700'
	};
</script>

<svelte:head>
	<link rel="icon" href="/favicons/{keyColor}.png?v=4ab2a37c" />
</svelte:head>

<div class="container">
	<main>
		<div class="titlebar">
			<div class="logomark">
				<div class="bee">
					<BeeIcon />
				</div>
			</div>
			<div class="rightActions">
				<Popover>
					<div class="prefsButton" slot="button">
						<SettingsIcon color="#979797" />
					</div>
					<div slot="contents">
						{#if $betaFeatures.useTimeline}
							<PrefOption
								handler={toggleLayout}
								checked={layoutIsTimeline}
								label="Display as a timeline."
							/>
						{/if}
						{#if $preferences.layout === Layout.grid}
							{#if $betaFeatures.useTimeline}
								<hr />
							{/if}
							<PrefOption
								handler={toggleGroupByDone}
								checked={groupByDone}
								label={`Move "done" goals to the bottom.`}
							/>
							<hr />
							<h6>Extra Details</h6>
							<PrefOption
								handler={(_) => toggleShowExtraData('description')}
								checked={$preferences.showExtraData.description}
								label="Description"
							/>
							<PrefOption
								handler={(_) => toggleShowExtraData('lastCompleted')}
								checked={$preferences.showExtraData.lastCompleted}
								label="Last completed"
							/>
							<PrefOption
								handler={(_) => toggleShowExtraData('rate')}
								checked={$preferences.showExtraData.rate}
								label="Rate"
							/>
							<PrefOption
								handler={(_) => toggleShowExtraData('maxBuffer')}
								checked={$preferences.showExtraData.maxBuffer}
								label="Maximum buffer"
							/>
							<PrefOption
								handler={(_) => toggleShowExtraData('finePrint')}
								checked={$preferences.showExtraData.finePrint}
								label="Fine print"
							/>
						{/if}
					</div>
				</Popover>
				<button on:click={signOut}>Sign Out</button>
			</div>
		</div>
		{#if layoutIsTimeline && $betaFeatures.useTimeline}
			<div
				transition:fade={{ duration: 100 }}
				class="tw-flex tw-min-h-[calc(100vh-8.5rem)] tw-w-[calc(100vw-48px)] tw-flex-row tw-justify-stretch tw-gap-4 tw-overflow-scroll tw-px-6 tw-pt-6"
			>
				{#each boardNumbers as n}
					<div
						class="{bgMappings[
							n
						]} tw-flex tw-min-w-44 tw-flex-1 tw-flex-col tw-gap-3 tw-rounded-[28px] tw-p-4"
					>
						<div class="tw-flex tw-flex-row tw-items-baseline tw-justify-between">
							<span
								class="{textColorMappings[
									n
								]} column-title tw-inline-block tw-py-2 tw-ps-1 tw-font-[Nunito] tw-font-extrabold"
								>{n}{n === 14 ? '+' : ''} day{n === 1 ? '' : 's'}</span
							>
							{#if n > 0}
								<span class="tw-pe-1 tw-text-sm tw-font-medium {textColorMappings[n]}"
									>{format(addDays(today, n), 'EE')}</span
								>
							{/if}
						</div>
						{#each allGoals as g (g.id)}
							{#if g.safebuf === n || (n === 14 && g.safebuf >= 14)}
								<Goal {...g} compact={true} />
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		{:else if 'goals' in goalsGrouped}
			<CardGrid goals={goalsGrouped.goals} />
		{:else if goalsGrouped.done?.length === 0}
			<CardGrid goals={goalsGrouped.notDone} />
		{:else if goalsGrouped.done?.length > 0}
			<CardGrid goals={goalsGrouped.notDone} />
			<div class="divider" />
			<CardGrid goals={goalsGrouped.done} />
		{/if}
	</main>
	<footer class="version">
		<span title="v{VERSION} ({DATE}): {DESCRIPTION}">v{VERSION}</span>
	</footer>
</div>

<style>
	.red .column-title {
		color: hsla(0, 100%, 39%, 1);
	}
	.orange .column-title {
		color: hsla(28, 100%, 47%, 1);
	}
	.yellow .column-title {
		color: hsla(52, 100%, 33%, 1);
	}
	.green .column-title {
		color: hsla(104, 100%, 25%, 1);
	}
	.blue .column-title {
		color: hsla(209, 100%, 37%, 1);
	}
	.purple .column-title {
		color: hsla(276, 100%, 40%, 1);
	}
	.red {
		background-color: hsla(0, 100%, 97%, 1);
	}
	.orange {
		background-color: hsla(28, 100%, 96%, 1);
	}
	.yellow {
		background-color: hsla(52, 100%, 96%, 1);
	}
	.green {
		background-color: hsla(104, 100%, 98%, 1);
	}
	.blue {
		background-color: hsla(215, 100%, 98%, 1);
	}
	.purple {
		background-color: hsla(277, 100%, 98%, 1);
	}
	.container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		min-height: 100vh;
		background-color: #fff;
	}
	main {
		flex: 1 0 auto;
		min-height: calc(100vh - 3rem);
	}
	.version {
		display: flex;
		flex-shrink: 0;
		height: 3rem;
		align-items: center;
		padding: 0 1.25rem;
		justify-content: flex-end;
		font-size: 0.75rem;
		color: #b8b8b8;
	}
	.version span {
		cursor: help;
	}
	.titlebar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0.4375rem 1.25rem;
		background-color: #fff;
		border-bottom: 1px solid #ebebeb;
	}
	.logomark {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
	}
	.bee {
		width: 1.8125rem;
		height: 1.75rem;
	}
	.rightActions {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		padding-right: 0.1875rem;
	}
	button {
		display: flex;
		background: none;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: #8f8f8f;
		padding: 0;
	}
	hr {
		border: 0;
		background-color: hsl(0, 0%, 94%);
		height: 2px;
		border-radius: 1rem;
	}
	h6 {
		color: hsl(0, 0%, 70%);
		font-size: 0.6875rem;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		margin-left: 1rem;
		text-transform: uppercase;
		font-weight: 800;
	}
	.prefsButton {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.5rem;
	}
	.divider {
		width: calc(100% - 2.5rem);
		border-top: 2px solid #f0f0f0;
		margin-left: 1.25rem;
		margin-right: 1.25rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
</style>
