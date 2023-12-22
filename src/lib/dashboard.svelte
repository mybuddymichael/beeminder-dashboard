<script lang="ts">
	import { onMount } from 'svelte';

	import { signOut } from './auth';
	import { popoverIsOpen, preferences } from '$lib/stores';
	import { fetchJson, fetchGoals } from '$lib/api';
	import { GroupByOption, groupGoals, mostPressingColor } from '$lib/goals';
	import { latestVersion } from '$lib/versions';
	import type { GoalClean, GoalGroup } from '$lib/goals';

	import { setGroupByOption, toggleShowExtraData } from './preferences';

	import BeeIcon from '$lib/bee-icon.svelte';
	import CardGrid from '$lib/card-grid.svelte';
	import Popover from '$lib/popover.svelte';
	import PrefOption from '$lib/pref-option.svelte';
	import SettingsIcon from '$lib/settings-icon.svelte';

	const versionObj = latestVersion();
	const VERSION = versionObj.version;
	const DATE = versionObj.date;
	const DESCRIPTION = versionObj.description;

	// Used to dynamically change the favicon.
	$: keyColor = mostPressingColor(allGoals);

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
					</div>
				</Popover>
				<button on:click={signOut}>Sign Out</button>
			</div>
		</div>
		{#if 'goals' in goalsGrouped}
			<CardGrid goals={goalsGrouped.goals} />
		{:else if goalsGrouped.done?.length === 0}
			<CardGrid goals={goalsGrouped.notDone} />
		{:else if goalsGrouped.done?.length > 0}
			<CardGrid goals={goalsGrouped.notDone} />
			<div class="divider" />
			<CardGrid goals={goalsGrouped.done} />
		{/if}
	</main>
	<footer class="version" title="v{VERSION} ({DATE}): {DESCRIPTION}">
		<span>v{VERSION}</span>
	</footer>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		min-height: 100vh;
		background-color: #fff;
	}
	main {
		flex: 1 0 auto;
	}
	.version {
		display: flex;
		flex-shrink: 0;
		padding: 1.25rem;
		justify-content: end;
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
		border-radius: 0.25rem;
	}
	.prefsButton:hover {
		background-color: #f7f7f7;
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
