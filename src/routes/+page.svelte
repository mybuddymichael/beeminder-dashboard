<script lang="ts">
	import { onMount } from 'svelte';
	import { signedIn } from '$lib/stores';

	import Login from '$lib/signin.svelte';
	import Dashboard from '$lib/dashboard.svelte';

	let loading = true;

	onMount(() => {
		if (localStorage.getItem('username') && localStorage.getItem('key')) {
			signedIn.set(true);
		}
		loading = false;
	});
</script>

{#if loading}
	<div class="loading" />
{:else if $signedIn}
	<Dashboard />
{:else}
	<Login />
{/if}
