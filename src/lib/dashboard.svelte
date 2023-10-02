<script lang="ts">
	import { onMount } from 'svelte';

	import { signOut } from './auth';
	import { fetchJson, fetchGoals, type GoalClean } from '$lib/api';
	import { latestVersion } from '$lib/versions';
	import { preferences } from '$lib/stores';
	import CardGrid from '$lib/card-grid.svelte';
	import BeeIcon from '$lib/bee-icon.svelte';
	import SettingsIcon from '$lib/settings-icon.svelte';
	import { GroupByOption, setGroupByOption } from './preferences';
	import { isToday } from 'date-fns';

	const versionObj = latestVersion();
	const VERSION = versionObj.version;
	const DATE = versionObj.date;
	const DESCRIPTION = versionObj.description;

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

	type GoalsUngrouped = {
		goals: GoalClean[];
	};
	type GoalsGroupedByDone = {
		notDone: GoalClean[];
		done: GoalClean[];
	};
	let allGoals: GoalClean[] = [];
	let goalsGrouped: GoalsUngrouped | GoalsGroupedByDone;

	const groupGoals = (goals: GoalClean[]) => {
		if ($preferences.groupBy === GroupByOption.ungrouped) {
			goalsGrouped = {
				goals
			};
		} else if ($preferences.groupBy === GroupByOption.done) {
			goalsGrouped = goals.reduce(
				(acc, goal) => {
					if (isToday(new Date(goal.lastday * 1000)) && goal.safebuf > 0) {
						return { notDone: [...acc.notDone], done: [...acc.done, goal] };
					}
					return { notDone: [...acc.notDone, goal], done: [...acc.done] };
				},
				{ notDone: [] as GoalClean[], done: [] as GoalClean[] }
			);
		}
	};

	$: $preferences && groupGoals(allGoals);

	const updateGoals = async () => {
		const updatedGoals = await fetchGoals(VERSION);
		if (updatedGoals) {
			allGoals = updatedGoals;
			groupGoals(allGoals);
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
			groupGoals(allGoals);
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
					</div>
				</div>
				<button on:click={signOut}>Sign Out</button>
			</div>
		</div>
		{#if 'goals' in goalsGrouped}
			<CardGrid goals={goalsGrouped.goals} />
		{:else if 'done' in goalsGrouped}
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
