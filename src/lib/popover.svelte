<script lang="ts">
	import { quartIn } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';

	import { popoverIsOpen, reset } from '$lib/stores';

	export let activeColor = 'rgba(0 0 0 / 0.04);';
	export let borderRadius = '0.25rem';
	export let padding = '1rem';
	export let isOpen = false;

	let shadowContents: HTMLElement;

	const transformSpring = spring(0, { stiffness: 0.22, damping: 0.485, precision: 0.0001 });
	const transformTween = tweened(0, { duration: 90, easing: quartIn });

	// Spring open, tween closed.
	$: animationValue = isOpen ? $transformSpring : $transformTween;

	$: if (!$popoverIsOpen) {
		// Something triggered a close of everything.
		close();
	}

	function open() {
		popoverIsOpen.set(false); // Close everything else.
		setTimeout(() => {
			isOpen = true;
			transformSpring.set(1);
			transformTween.set(1);
			popoverIsOpen.set(true);
		}, 10); // Need to wait a beat to process closing before opening this one.
	}

	function close() {
		isOpen = false;
		popoverIsOpen.set(false);
		transformSpring.set(0);
		transformTween.set(0);
	}

	function toggleOpen(e: Event) {
		if (isOpen) {
			close();
		} else {
			open();
		}
	}
</script>

<div class="container" style={`--padding: ${padding};`}>
	<button
		on:click|stopPropagation={toggleOpen}
		class:isOpen
		style={`--active-color: ${activeColor}; --border-radius: ${borderRadius};;`}
	>
		<slot name="button" />
	</button>
	<div
		class="contents"
		style="transform: scale({animationValue}); opacity: {animationValue};"
		role="menu"
		tabindex="0"
		on:click|stopPropagation
		on:keydown|stopPropagation
	>
		<slot name="contents" />
	</div>
</div>

<style>
	.container {
		position: relative; /* .contents will position against this */
	}
	button {
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		border-radius: var(--border-radius);
	}
	button.isOpen,
	button:hover {
		background-color: var(--active-color);
	}
	.contents {
		--y-offset: calc(100% + 0.5rem);
		transform-origin: top right;
		width: max-content;
		position: absolute;
		top: var(--y-offset);
		right: 0;
		background: linear-gradient(to bottom, #fff, #fdfdfd);
		border-radius: 0.5rem;
		--shadow-color: rgb(0 0 0 / 0.06);
		box-shadow:
			0px 0px 0px 1px var(--shadow-color),
			0px 1px 1px -0.5px var(--shadow-color),
			0px 3px 3px -1.5px var(--shadow-color),
			0px 6px 6px -3px var(--shadow-color),
			0px 12px 12px -6px var(--shadow-color),
			0px 24px 24px -12px var(--shadow-color);
		padding: var(--padding);
		z-index: 100;
	}
</style>
