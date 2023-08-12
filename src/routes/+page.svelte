<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { userToken } from '$lib/stores';
	import Login from '$lib/login.svelte';
	import type { AuthToken } from '$lib/auth';

	let loading = true;
	let hasToken = false;

	onMount(() => {
		if (localStorage.getItem('username') && localStorage.getItem('auth_token')) {
			hasToken = true;
		} else {
			hasToken = false;
		}
		loading = false;
	});

	$: {
		if ('username' in $userToken && 'auth_token' in $userToken) {
			localStorage.setItem('username', ($userToken as AuthToken).username);
			localStorage.setItem('auth_token', ($userToken as AuthToken).auth_token);
			loading = false;
			hasToken = true;
		} else {
			hasToken = false;
		}
	}

	function logout() {
		localStorage.setItem('username', '');
		localStorage.setItem('auth_token', '');
		userToken.set({});
	}
</script>

{#if loading}
	<div class="loading" />
{:else if hasToken}
	<p on:click={logout}>Boom</p>
{:else}
	<Login />
{/if}
