<script lang="ts">
	import { quartIn } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';

	import { popoverIsOpen, reset } from '$lib/stores';
	import { onMount } from 'svelte';

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
		e.stopPropagation();
		if (isOpen) {
			close();
		} else {
			open();
		}
	}

	let rightOffset: number;
	let yOffsetSide: string;
	let shadowDisplay: string;
	function resetPosition() {
		rightOffset = 0;
		yOffsetSide = 'top';
		shadowDisplay = '';
	}
	function adjustPosition() {
		resetPosition();
		const documentHeight = document.getElementsByTagName('html')[0].offsetHeight;
		console.log(documentHeight);
		const contentsRect = shadowContents.getBoundingClientRect();
		console.log(contentsRect);
		if (contentsRect.x < 16) {
			rightOffset = -16 + contentsRect.x;
		}
		if (contentsRect.bottom > documentHeight - 16) {
			yOffsetSide = 'bottom';
		}
		shadowDisplay = 'display: none;';
	}
	onMount(() => {
		adjustPosition();
		window.addEventListener('resize', () => setTimeout(adjustPosition, 50));

		return () => {
			window.removeEventListener('resize', adjustPosition);
		};
	});
</script>

<div class="container" style={`--padding: ${padding};`}>
	<button
		on:click={toggleOpen}
		class:isOpen
		style={`--active-color: ${activeColor}; --border-radius: ${borderRadius};;`}
	>
		<slot name="button" />
	</button>
	<div
		class="contents"
		style="transform: scale({animationValue}); opacity: {animationValue}; right: {rightOffset}px; {yOffsetSide}: var(--y-offset);"
		role="menu"
		tabindex="0"
		on:click={(e) => e.stopPropagation()}
		on:keydown={(e) => e.stopPropagation()}
	>
		<slot name="contents" />
	</div>
	<div bind:this={shadowContents} class="contents" style={shadowDisplay}>
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
		--y-offset: calc(100% + 0.75rem);
		transform-origin: top right;
		width: max-content;
		position: absolute;
		right: 0;
		background: linear-gradient(to bottom, #fff, #fdfdfd);
		border-radius: 0.5rem;
		--shadow-color: rgb(0 0 0 / 0.06);
		box-shadow: 0px 0px 0px 1px var(--shadow-color), 0px 1px 1px -0.5px var(--shadow-color),
			0px 3px 3px -1.5px var(--shadow-color), 0px 6px 6px -3px var(--shadow-color),
			0px 12px 12px -6px var(--shadow-color), 0px 24px 24px -12px var(--shadow-color);
		padding: var(--padding);
		z-index: 100;
	}
</style>
