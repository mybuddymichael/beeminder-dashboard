import { emoji as emojiStore } from '$lib/stores';

export enum EmojiCategory {
	people = 'People',
	animalsAndNature = 'Animals & Nature',
	foodAndDrink = 'Food & Drink',
	objects = 'Objects'
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
	{ name: 'Flexed Biceps', emoji: '💪', category: EmojiCategory.people },
	{ name: 'Folded Hands', emoji: '🙏', category: EmojiCategory.people },
	{ name: 'Writing Hand', emoji: '✍️', category: EmojiCategory.people },
	{ name: 'Brain', emoji: '🧠', category: EmojiCategory.people },
	{ name: 'Anatomical Heart', emoji: '🫀', category: EmojiCategory.people },
	{ name: 'Lungs', emoji: '🫁', category: EmojiCategory.people },
	{ name: 'Person Lifting Weights', emoji: '🏋️', category: EmojiCategory.people },
	{ name: 'Person Running', emoji: '🏃', category: EmojiCategory.people },
	{ name: 'Technologist', emoji: '🧑‍💻', category: EmojiCategory.people },

	{ name: 'Dog Face', emoji: '🐶', category: EmojiCategory.animalsAndNature },
	{ name: 'Droplet', emoji: '💧', category: EmojiCategory.animalsAndNature },
	{ name: 'Water Wave', emoji: '🌊', category: EmojiCategory.animalsAndNature },

	{ name: 'Avocado', emoji: '🥑', category: EmojiCategory.foodAndDrink },
	{ name: 'Carrot', emoji: '🥕', category: EmojiCategory.foodAndDrink },
	{ name: 'Green Salad', emoji: '🥗', category: EmojiCategory.foodAndDrink },
	{ name: 'Potable Water', emoji: '🚰', category: EmojiCategory.foodAndDrink },
	{ name: 'Red Apple', emoji: '🍎', category: EmojiCategory.foodAndDrink },

	{ name: 'Running Shoe', emoji: '👟', category: EmojiCategory.objects },
	{ name: 'Toothbrush', emoji: '🪥', category: EmojiCategory.objects },
	{ name: 'Dollar Banknote', emoji: '💵', category: EmojiCategory.objects },
	{ name: 'Hourglass Not Done', emoji: '⏳', category: EmojiCategory.objects },
	{ name: 'Alarm Clock', emoji: '⏰', category: EmojiCategory.objects },
	{ name: 'Desktop Computer', emoji: '🖥️', category: EmojiCategory.objects },
	{ name: 'Laptop', emoji: '💻', category: EmojiCategory.objects },
	{ name: 'Books', emoji: '📚', category: EmojiCategory.objects },
	{ name: 'Closed Book', emoji: '📕', category: EmojiCategory.objects },
	{ name: 'Open Book', emoji: '📖', category: EmojiCategory.objects }
];

// Old Reference
// prettier-ignore
const _ = [
		'💪', '👂', '👀', '🧠', '🫁', '🫀',
		'📱', '📷', '⏰', '⏳', '💡', '🪫', '🖥️',
		'🪥', '🚰', '🛌', '📥', '📈', '✍️', '👨‍💻'
	]
