import { emoji as emojiStore } from '$lib/stores';

export type EmojiGoal = {
	emoji: string;
	goal: string;
};

export const setLocalStorageEmoji = (emoji: EmojiGoal[]) => {
	try {
		localStorage?.setItem('emoji', JSON.stringify(emoji));
	} catch {
		null;
	}
};

export const getLocalStorageEmoji = () => {
	try {
		return JSON.parse(localStorage?.getItem('emoji') ?? '') as EmojiGoal[];
	} catch {
		return [];
	}
};

export const updateEmoji = (emoji: string, goal: string) => {
	emojiStore.update((prev) => {
		const cleaned = prev.filter((e: EmojiGoal) => e.goal !== goal);
		return [...cleaned, { emoji, goal }];
	});
};
