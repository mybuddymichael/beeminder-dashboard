import { preferences } from '$lib/stores';

type LastCompletedFormat = 'relative' | 'distance';

type Preferences = {
	showExtraData: {
		description: boolean;
		lastCompleted: boolean;
		rate: boolean;
		finePrint: boolean;
	};
	lastCompletedFormat: LastCompletedFormat;
};

const defaultPreferences: Preferences = {
	showExtraData: {
		description: true,
		lastCompleted: true,
		rate: true,
		finePrint: true
	},
	lastCompletedFormat: 'distance'
};

export const setLocalStoragePreferences = (prefs: Preferences) => {
	try {
		localStorage?.setItem('preferences', JSON.stringify(prefs));
	} catch {
		null;
	}
};

export const getLocalStoragePreferences = () => {
	try {
		return JSON.parse(localStorage?.getItem('preferences') ?? '') as Preferences;
	} catch {
		return defaultPreferences;
	}
};

export const toggleLastCompletedFormat = (prevLastCompletedFormat: LastCompletedFormat) => {
	const newOption = prevLastCompletedFormat === 'relative' ? 'distance' : 'relative';
	preferences.update((prev) => {
		return { ...prev, lastCompletedFormat: newOption };
	});
};
