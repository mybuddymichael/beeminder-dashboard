import { emoji as emojiStore } from '$lib/stores';

enum EmojiCategory {
	exercise = 'Exercise',
	faith = 'Faith',
	food = 'Food',
	health = 'Health',
	productivity = 'Productivity',
	reading = 'Reading'
}
type EmojiName = string;
type Emoji = string;

type EmojiObject = {
	name: EmojiName;
	emoji: Emoji;
	category: EmojiCategory;
};

export type EmojiGoal = {
	emoji: Emoji;
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

export const updateEmoji = (emoji: Emoji, goal: string) => {
	emojiStore.update((prev) => {
		const cleaned = prev.filter((e) => e.goal !== goal);
		return [...cleaned, { emoji, goal }];
	});
};

export const emojis: EmojiObject[] = [
	{ name: 'Flexed Biceps', emoji: '💪', category: EmojiCategory.exercise },
	{ name: 'Person Lifting Weights', emoji: '🏋️', category: EmojiCategory.exercise },
	{ name: 'Person Running', emoji: '🏃', category: EmojiCategory.exercise },
	{ name: 'Running Shoe', emoji: '👟', category: EmojiCategory.exercise },

	{ name: 'Carrot', emoji: '🥕', category: EmojiCategory.food },
	{ name: 'Green Salad', emoji: '🥗', category: EmojiCategory.food },
	{ name: 'Potable Water', emoji: '🚰', category: EmojiCategory.food },
	{ name: 'Red Apple', emoji: '🍎', category: EmojiCategory.food },

	{ name: 'Toothbrush', emoji: '🪥', category: EmojiCategory.health },

	{ name: 'Alarm Clock', emoji: '⏰', category: EmojiCategory.productivity },
	{ name: 'Brain', emoji: '🧠', category: EmojiCategory.productivity },
	{ name: 'Hourglass Not Done', emoji: '⏳', category: EmojiCategory.productivity },
	{ name: 'Writing Hand', emoji: '✍️', category: EmojiCategory.productivity },

	{ name: 'Books', emoji: '📚', category: EmojiCategory.reading },
	{ name: 'Closed Book', emoji: '📕', category: EmojiCategory.reading },
	{ name: 'Open Book', emoji: '📖', category: EmojiCategory.reading }
];

// Old Reference
// prettier-ignore
const _ = [
		'💪', '👂', '👀', '🧠', '🫁', '🫀',
		'📱', '📷', '⏰', '⏳', '💡', '🪫', '🖥️',
		'🪥', '🚰', '🛌', '📥', '📈', '✍️', '👨‍💻'
	]
