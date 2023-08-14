<script lang="ts">
	import { onMount } from 'svelte';
	import { logout } from './auth';
	import BeeIcon from './bee-icon.svelte';

	type Goal = {
		baremin: string;
		losedate: number;
		pledge: number;
		safebuf: number;
		slug: string;
		title: string;
	};

	let goals: Goal[] = [];

	onMount(async function () {
		try {
			goals = JSON.parse(localStorage.getItem('goals') || '');
		} catch {}
		goals = await fetch(
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
				localStorage.setItem('goals', JSON.stringify(data));
				return data;
			})
			.catch((error) => {
				// TODO: Add error notice.
				console.log(error);
			});
	});
</script>

<div class="main">
	<div class="titlebar">
		<div class="logomark">
			<div class="bee">
				<BeeIcon />
			</div>
			<!-- <div class="title">Beeminder Dashboard</div> -->
		</div>
		<button on:mousedown={logout}>Sign Out</button>
	</div>
	<div class="cards">
		{goals?.length}
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
	.title {
		font-weight: 700;
		font-size: 0.875rem;
	}
	button {
		background: none;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: #8f8f8f;
	}
</style>
