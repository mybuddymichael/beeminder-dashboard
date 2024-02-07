<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { betaFeatures, preferences, signedIn, username } from '$lib/stores';

	import SignIn from '$lib/signin.svelte';
	import Dashboard from '$lib/dashboard.svelte';

	import { Layout } from '$lib/preferences';

	let loading = true;
	const useTimeline = $page.url.searchParams.has('timeline');
	const useEmoji = $page.url.searchParams.has('emoji');
	$: if (useEmoji) {
		betaFeatures.update((prev) => {
			return { ...prev, useEmoji: true };
		});
	}
	$: if (useTimeline) {
		betaFeatures.update((prev) => {
			return { ...prev, useTimeline: true };
		});
	} else {
		preferences.update((prev) => {
			return { ...prev, layout: Layout.grid };
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
