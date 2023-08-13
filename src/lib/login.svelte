<script lang="ts">
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { login, type AuthToken } from './auth';
	import BeeIcon from './bee-icon.svelte';

	let inputValue = '';
	// TODO: Add feedback for a non-token submission.
	let badToken;

	function checkForEnter(e: KeyboardEvent) {
		if (e.key === 'Enter' && inputValue.length > 0) {
			handleSubmit();
		}
	}

	function getTokenObject(tokenString: string): AuthToken | null {
		let token;
		try {
			token = JSON.parse(tokenString);
		} catch {
			return null;
		}
		if (typeof token !== 'object') {
			return null;
		}
		if ('username' in token && 'auth_token' in token) {
			return token;
		}
		return null;
	}

	function handleSubmit() {
		let token;
		if ((token = getTokenObject(inputValue))) {
			login(token);
		}
	}
</script>

<div class="main">
	<div class="login">
		<div class="bee">
			<BeeIcon />
		</div>
		<h1>Beeminder Dashboard</h1>
		<div class="input-container">
			<input
				type="text"
				placeholder="API token (JSON)"
				bind:value={inputValue}
				on:keydown={checkForEnter}
			/>
			{#if inputValue}
				<button on:click={handleSubmit} in:scale={{ duration: 100, easing: cubicOut }}>-></button>
			{/if}
		</div>
		<div class="help">
			<p>Don't have your API token?</p>
			<p>
				Sign into Beeminder, then click <a href="https://www.beeminder.com/api/v1/auth_token.json"
					>here</a
				>.
			</p>
		</div>
	</div>
	<div class="fine-print">
		<p>This project is not associated with beeminder.com.</p>
		<p>
			All your data is stored locally on this device. (<a
				href="https://github.com/mybuddymichael/beeminder">Source code</a
			>.)
		</p>
	</div>
</div>

<style>
	.main {
		height: 100vh;
		margin-top: -6rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 44px;
		padding: 0 6rem;
		--corner-radius: 1rem;
	}
	.login {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2.7rem;
	}
	.bee {
		width: 4.25rem;
	}
	h1 {
		margin: 0;
		padding: 0;
		font-size: 1.75rem;
		font-style: normal;
		font-weight: var(--font-weight-title);
		line-height: normal;
		text-align: center;
	}
	.input-container {
		height: 3.5rem;
		width: 29rem;
		max-width: calc(100vw - 6rem);
		display: flex;
		gap: 0.5rem;
	}
	input {
		height: 100%;
		flex-grow: 1;
		border-radius: var(--corner-radius);
		background: var(--color-input-background);
		border: 0;
		padding: 0 1.3125rem;
		font-size: 1rem;
	}
	input:focus {
		border: 0;
		outline: none;
	}
	input::placeholder {
		color: var(--color-input-placeholder);
	}
	button {
		width: 3.5rem;
		font-size: 2rem;
		font-weight: 600;
		border-radius: var(--corner-radius);
		background-color: var(--color-yellow-2);
		border: 0;
	}
	.help,
	.fine-print {
		color: var(--color-help-text);
		text-align: center;
		font-size: 0.75rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.125rem; /* 150% */
	}
	.help a {
		color: var(--color-link);
		font-weight: var(--font-weight-link);
		text-decoration: none;
		display: inline-block;
		border-bottom: 1px solid;
		height: 1rem;
	}
	p {
		margin: 0;
	}
	.fine-print {
		color: var(--color-fine-print-text);
		position: absolute;
		bottom: 1rem;
		transition: color 0.15s;
	}
	.fine-print a {
		color: inherit;
		font-weight: var(--font-weight-link);
	}
	.fine-print:hover {
		color: var(--color-help-text);
	}
</style>
