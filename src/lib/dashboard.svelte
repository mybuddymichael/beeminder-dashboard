<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	import { signOut } from './auth';
	import { fetchJson, fetchGoals, type Goal } from '$lib/api';
	import { latestVersion } from '$lib/versions';
	import BeeIcon from './bee-icon.svelte';
	import GoalCard from './goal.svelte';

	const versionObj = latestVersion();
	const VERSION = versionObj.version;
	const DATE = versionObj.date;
	const DESCRIPTION = versionObj.description;

	let goals: Goal[] = [];

	const updateGoals = async () => {
		const updatedGoals = await fetchGoals(VERSION);
		updatedGoals && (goals = updatedGoals);
	};

	const versionCheckIntervalInMs = 1000 * 30; // 30s in ms.
	const beeminderRefreshIntervalInMs = 1000 * 60; // One minute in ms.
	let timeToBeeminderRefresh: number;
	const fetchAndReset = () => {
		updateGoals();
		timeToBeeminderRefresh = beeminderRefreshIntervalInMs;
	};
	onMount(function () {
		// Load goals from localStorage if they exist.
		try {
			goals = JSON.parse(localStorage.getItem('goals') || '');
		} catch {}
		// Update goals (if necessary).
		updateGoals();
		// Check for new Beeminder data every minute.
		timeToBeeminderRefresh = beeminderRefreshIntervalInMs;
		const beeminderCheckInterval = setInterval(async () => {
			timeToBeeminderRefresh -= 1000;
			if (timeToBeeminderRefresh <= 0) {
				fetchAndReset();
			}
		}, 1000);
		// Check for a new dashboard version every so often.
		const checkServerVersionInterval = setInterval(async () => {
			if ((await fetchJson('/version')) !== VERSION) {
				location.reload();
			}
		}, versionCheckIntervalInMs); // 30 seconds.
		// Clear intervals on component unmount.
		return () => {
			clearInterval(beeminderCheckInterval);
			clearInterval(checkServerVersionInterval);
		};
	});

	$: minutesToRefresh = Math.floor(timeToBeeminderRefresh / 1000 / 60);
	$: secondsToRefresh = `${(timeToBeeminderRefresh / 1000) % 60}`;
	$: if (secondsToRefresh === '0') {
		secondsToRefresh = '00';
	} else if (parseInt(secondsToRefresh) < 10) {
		secondsToRefresh = `0${secondsToRefresh}`;
	}
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
				{#if dev}<button class="reset" on:mousedown={fetchAndReset}>Check Now</button>{/if}
				<div class="refreshTimer">
					Refreshing in <span class="clock">{minutesToRefresh}:{secondsToRefresh}</span>
				</div>
				<button on:mousedown={signOut}>Sign Out</button>
			</div>
		</div>
		<div class="cards">
			{#each goals as goal (goal.id)}
				<div animate:flip={{ duration: 300 }}>
					<GoalCard {...goal} />
				</div>
			{/each}
		</div>
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
		padding: 0.75rem 1.25rem;
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
		align-items: baseline;
		gap: 1rem;
	}
	.refreshTimer {
		font-size: 0.875rem;
		font-weight: 500;
		line-height: normal;
		color: #b8b8b8;
	}
	.clock {
		display: inline-block;
		width: 2rem;
	}
	button {
		background: none;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: #8f8f8f;
	}
	.cards {
		--columns: 1;
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		padding: 1.25rem;
		gap: 1.25rem;
	}
	@media screen and (min-width: 620px) {
		.cards {
			--columns: 2;
		}
	}
	@media screen and (min-width: 900px) {
		.cards {
			--columns: 3;
		}
	}
	@media screen and (min-width: 1200px) {
		.cards {
			--columns: 4;
		}
	}
	@media screen and (min-width: 1500px) {
		.cards {
			--columns: 5;
		}
	}
	@media screen and (min-width: 1800px) {
		.cards {
			--columns: 6;
		}
	}
	@media screen and (min-width: 2100px) {
		.cards {
			--columns: 7;
		}
	}
	@media screen and (min-width: 2400px) {
		.cards {
			--columns: 8;
		}
	}
</style>
