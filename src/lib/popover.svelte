<script lang="ts">
	import { quartIn } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';

	import { popoverIsOpen } from '$lib/stores';

	const transformSpring = spring(0, { stiffness: 0.22, damping: 0.485, precision: 0.0001 });
	const transformTween = tweened(0, { duration: 90, easing: quartIn });

	let isOpen = false;
	// Spring open, tween closed.
	$: animationValue = isOpen ? $transformSpring : $transformTween;

	$: if (!$popoverIsOpen) {
		// Something triggered a close of everything.
		close();
	}

	function open() {
		popoverIsOpen.set(false); // Close everything else.
		isOpen = true;
		transformSpring.set(1);
		transformTween.set(1);
		popoverIsOpen.set(true);
	}

	function close() {
		isOpen = false;
		popoverIsOpen.set(false);
		transformSpring.set(0);
		transformTween.set(0);
	}

	function toggleOpen(e: Event) {
		e.stopPropagation();
		if (isOpen) {
			close();
		} else {
			open();
		}
	}
</script>

<div class="container">
	<button on:click={toggleOpen}>
		<slot name="button" />
	</button>
	<div
		class="contents"
		style="transform: scale({animationValue}); opacity: {animationValue}"
		role="menu"
		tabindex="0"
		on:click={(e) => e.stopPropagation()}
		on:keydown={(e) => e.stopPropagation()}
	>
		<slot name="contents" />
	</div>
</div>

<style>
	.container {
		position: relative;
	}
	button {
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
	}
	.contents {
		transform-origin: top right;
		width: max-content;
		position: absolute;
		top: calc(100% + 0.75rem);
		right: 0;
		background-color: #fff;
		border: 1px solid #efefef;
		border-radius: 0.5rem;
		--shadow-color: rgb(0 0 0 / 0.06);
		box-shadow: 0px 0px 0px 1px var(--shadow-color), 0px 1px 1px -0.5px var(--shadow-color),
			0px 3px 3px -1.5px var(--shadow-color), 0px 6px 6px -3px var(--shadow-color),
			0px 12px 12px -6px var(--shadow-color), 0px 24px 24px -12px var(--shadow-color);
		padding: 1rem;
		z-index: 100;
	}
</style>