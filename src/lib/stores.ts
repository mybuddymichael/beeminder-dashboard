import { writable } from 'svelte/store';
import {
	defaultPreferences,
	getLocalStoragePreferences,
	setLocalStoragePreferences
} from '$lib/preferences';
import { getLocalStorageEmoji, setLocalStorageEmoji } from './emoji';

export const emoji = writable(getLocalStorageEmoji());
emoji.subscribe((value) => {
	setLocalStorageEmoji(value);
});

export const popoverIsOpen = writable(false);

export const preferences = writable(getLocalStoragePreferences());
preferences.subscribe((value) => {
	setLocalStoragePreferences(value);
});

export const signedIn = writable(false);
export const username = writable('');

export const reset = () => {
	signedIn.set(false);
	username.set('');
	preferences.set(defaultPreferences);
	emoji.set([]);
};
