<script lang="ts">
	import { onMount } from 'svelte';
	import { signOut } from './auth';
	import BeeIcon from './bee-icon.svelte';
	import GoalCard from './goal.svelte';

	type Goal = {
		baremin: string;
		id: string;
		losedate: number;
		pledge: number;
		safebuf: number;
		slug: string;
		title: string;
	};

	let goals: Goal[] = [];

	const fetchGoals = async function () {
		let apiGoals: Goal[] = [];
		try {
			goals = JSON.parse(localStorage.getItem('goals') || '');
		} catch {}
		apiGoals = await fetch(
			`https://www.beeminder.com/api/v1/users/me/goals.json?auth_token=${localStorage.getItem(
				'key'
			)}`
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error();
				}
				return response.json();
			})
			.then((data) => {
				return data;
			})
			.catch((error) => {
				// TODO: Add error notice.
			});
		goals = apiGoals.map(({ baremin, id, losedate, pledge, safebuf, slug, title }) => {
			return {
				baremin,
				id,
				losedate,
				pledge,
				safebuf,
				slug,
				title
			};
		});
		localStorage.setItem('goals', JSON.stringify(goals));
		console.log(goals);
	};

	let timeToRefresh: number;
	onMount(function () {
		fetchGoals();
		const refreshInterval = 1000 * 60 * 10; // 10 minutes.
		timeToRefresh = refreshInterval;
		// 10 minuets		let refreshTime =
		const interval = setInterval(() => {
			timeToRefresh -= 1000;
			if (timeToRefresh <= 0) {
				fetchGoals();
				timeToRefresh = refreshInterval;
			}
		}, 1000);
		return () => clearInterval(interval);
	});

	$: minutesToRefresh = Math.floor(timeToRefresh / 1000 / 60);
	$: secondsToRefresh = `${(timeToRefresh / 1000) % 60}`;
	$: if (secondsToRefresh === '0') {
		secondsToRefresh = '00';
	} else if (parseInt(secondsToRefresh) < 10) {
		secondsToRefresh = `0${secondsToRefresh}`;
	}
</script>

<div class="main">
	<div class="titlebar">
		<div class="logomark">
			<div class="bee">
				<BeeIcon />
			</div>
		</div>
		<div class="rightActions">
			<div class="refreshTimer">
				Refreshing in <span class="clock">{minutesToRefresh}:{secondsToRefresh}</span>
			</div>
			<button on:mousedown={signOut}>Sign Out</button>
		</div>
	</div>
	<div class="cards">
		{#each goals as goal (goal.id)}<GoalCard {...goal} />{/each}
	</div>
</div>

<style>
	.main {
		width: 100vw;
		min-height: 100vh;
		background-color: #f7f7f7;
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
