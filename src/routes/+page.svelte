<script lang="ts">
	import { onMount } from 'svelte';
	import { betaFeatures, signedIn, username } from '$lib/stores';
	import { page } from '$app/stores';

	import SignIn from '$lib/signin.svelte';
	import Dashboard from '$lib/dashboard.svelte';

	let loading = true;
	const useEmoji = $page.url.searchParams.has('emoji');
	$: if (useEmoji) {
		betaFeatures.update((prev) => {
			return { ...prev, useEmoji: true };
		});
	}

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
