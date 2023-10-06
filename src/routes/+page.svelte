<script lang="ts">
	import { onMount } from 'svelte';
	import { signedIn, username } from '$lib/stores';

	import SignIn from '$lib/signin.svelte';
	import Dashboard from '$lib/dashboard.svelte';

	let loading = true;

	onMount(() => {
		const u = localStorage.getItem('username');
		if (u && localStorage.getItem('key')) {
			signedIn.set(true);
			username.set(u); // If they navigate here while already signed in.
		}
		loading = false;
	});
</script>

{#if loading}
	<div class="loading" />
{:else if $signedIn}
	<Dashboard />
{:else}
	<SignIn />
{/if}
