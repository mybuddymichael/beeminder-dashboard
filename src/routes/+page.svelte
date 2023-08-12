<script lang="ts">
	import { onMount } from 'svelte';
	import { loggedIn } from '$lib/stores';
	import { logout } from '$lib/auth';

	import Login from '$lib/login.svelte';

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
	<button on:mousedown={logout}>Boom</button>
{:else}
	<Login />
{/if}
