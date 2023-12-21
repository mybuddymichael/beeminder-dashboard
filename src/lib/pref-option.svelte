<script lang="ts">
	export let handler: (e: Event) => void;
	export let checked: boolean;
	export let label: string;
</script>

<div class="pref" role="button" tabindex="0" on:click={handler} on:keypress={handler}>
	<input type="checkbox" bind:checked />
	<div class="label">{label}</div>
</div>

<style>
	.pref {
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
		gap: 0.3rem;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}
	.pref:hover {
		background-color: #f7f7f7;
	}
	.pref input {
		cursor: pointer;
		/* margin-top: 0.2125rem; */
		width: 2rem;
	}
	.pref .label {
		font-size: 0.8125rem;
		font-weight: 500;
		max-width: 8rem;
		line-height: 1.25rem;
		user-select: none;
	}
</style>
