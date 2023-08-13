<script lang="ts">
	import { onMount } from 'svelte';
	import { loggedIn } from '$lib/stores';

	import Login from '$lib/login.svelte';
	import Dashboard from '$lib/dashboard.svelte';

	let loading = true;

	onMount(() => {
		if (localStorage.getItem('username') && localStorage.getItem('key')) {
			loggedIn.set(true);
		}
		loading = false;
	});
</script>

{#if loading}
	<div class="loading" />
{:else if $loggedIn}
	<Dashboard />
{:else}
	<Login />
{/if}
