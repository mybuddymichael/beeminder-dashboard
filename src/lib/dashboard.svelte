<script lang="ts">
	import { onMount } from 'svelte';

	import { signOut } from './auth';
	import { preferences } from '$lib/stores';
	import { fetchJson, fetchGoals } from '$lib/api';
	import { GroupByOption, groupGoals, mostPressingColor } from '$lib/goals';
	import { latestVersion } from '$lib/versions';
	import type { GoalClean, GoalGroup } from '$lib/goals';

	import { setGroupByOption, toggleShowExtraData } from './preferences';

	import CardGrid from '$lib/card-grid.svelte';
	import BeeIcon from '$lib/bee-icon.svelte';
	import SettingsIcon from '$lib/settings-icon.svelte';

	const versionObj = latestVersion();
	const VERSION = versionObj.version;
	const DATE = versionObj.date;
	const DESCRIPTION = versionObj.description;

	$: keyColor = mostPressingColor(allGoals);

	let showPrefs = false;
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

	const togglePrefs = (e: MouseEvent) => {
		showPrefs = !showPrefs;
		e.stopPropagation();
	};
	const hidePrefs = (e: MouseEvent) => {
		showPrefs = false;
		e.stopPropagation();
	};
	const stopPropagation = (e: Event) => e.stopPropagation();

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
		document.addEventListener('click', hidePrefs);
		// Clean up on component unmount.
		return () => {
			clearInterval(updateInterval);
			window.removeEventListener('focus', updateGoals);
			document.removeEventListener('click', hidePrefs);
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
				<div class="prefs">
					<button on:click={togglePrefs}><SettingsIcon color="#979797" /> </button>
					<div
						class="prefsMenu"
						class:showPrefs
						role="menu"
						tabindex="0"
						on:click={stopPropagation}
						on:keydown={stopPropagation}
					>
						<div
							class="pref"
							role="button"
							tabindex="0"
							on:click={toggleGroupByDone}
							on:keypress={toggleGroupByDone}
						>
							<input type="checkbox" bind:checked={groupByDone} />
							<div class="label">Move "done" goals to the bottom.</div>
						</div>
						<hr />
						<h6>Extra Details</h6>
						<div
							class="pref"
							role="button"
							tabindex="0"
							on:click={(e) => toggleShowExtraData('description')}
							on:keypress={(e) => toggleShowExtraData('description')}
						>
							<input type="checkbox" bind:checked={$preferences.showExtraData.description} />
							<div class="label">Description</div>
						</div>
						<div
							class="pref"
							role="button"
							tabindex="0"
							on:click={(e) => toggleShowExtraData('lastCompleted')}
							on:keypress={(e) => toggleShowExtraData('lastCompleted')}
						>
							<input type="checkbox" bind:checked={$preferences.showExtraData.lastCompleted} />
							<div class="label">Last completed</div>
						</div>
						<div
							class="pref"
							role="button"
							tabindex="0"
							on:click={(e) => toggleShowExtraData('rate')}
							on:keypress={(e) => toggleShowExtraData('rate')}
						>
							<input type="checkbox" bind:checked={$preferences.showExtraData.rate} />
							<div class="label">Rate</div>
						</div>
						<div
							class="pref"
							role="button"
							tabindex="0"
							on:click={(e) => toggleShowExtraData('maxBuffer')}
							on:keypress={(e) => toggleShowExtraData('maxBuffer')}
						>
							<input type="checkbox" bind:checked={$preferences.showExtraData.maxBuffer} />
							<div class="label">Max buffer</div>
						</div>
						<div
							class="pref"
							role="button"
							tabindex="0"
							on:click={(e) => toggleShowExtraData('finePrint')}
							on:keypress={(e) => toggleShowExtraData('finePrint')}
						>
							<input type="checkbox" bind:checked={$preferences.showExtraData.finePrint} />
							<div class="label">Fine print</div>
						</div>
					</div>
				</div>
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
		background-color: #f7f7f7;
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
	.prefs {
		display: flex;
		position: relative;
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
	.prefs button {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.5rem;
		border-radius: 0.25rem;
	}
	.prefs button:hover {
		background-color: #f7f7f7;
	}
	.prefsMenu {
		display: none;
		width: max-content;
		position: absolute;
		top: calc(100% + 0.75rem);
		right: 0;
		background-color: #fff;
		border: 1px solid #efefef;
		border-radius: 0.5rem;
		box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		z-index: 100;
	}
	.prefsMenu.showPrefs {
		display: block;
	}
	.pref {
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
		gap: 0.3rem;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}
	.pref:hover {
		background-color: #f7f7f7;
	}
	.pref input {
		cursor: pointer;
		/* margin-top: 0.2125rem; */
		width: 2rem;
	}
	.pref .label {
		font-size: 0.8125rem;
		font-weight: 500;
		max-width: 8rem;
		line-height: 1.25rem;
		user-select: none;
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
