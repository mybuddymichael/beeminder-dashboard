import { writable } from 'svelte/store';
import { getLocalStoragePreferences, setLocalStoragePreferences } from '$lib/preferences';

export const signedIn = writable(false);
export const username = writable('');
export const preferences = writable(getLocalStoragePreferences());

preferences.subscribe((value) => {
	setLocalStoragePreferences(value);
});
