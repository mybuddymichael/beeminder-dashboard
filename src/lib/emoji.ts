export enum EmojiCategory {
	exercise,
	food,
	life,
	productivity,
	reading,
	faith
}

export type EmojiObject = {
	name: string;
	emoji: string;
	category: EmojiCategory;
};

export const emoji: EmojiObject[] = [
	{ name: 'Flexed Biceps', emoji: '💪', category: EmojiCategory.exercise },
	{ name: 'Person Lifting Weights', emoji: '🏋️', category: EmojiCategory.exercise },
	{ name: 'Person Running', emoji: '🏃', category: EmojiCategory.exercise },
	{ name: 'Running Shoe', emoji: '👟', category: EmojiCategory.exercise },

	{ name: 'Carrot', emoji: '🥕', category: EmojiCategory.food },
	{ name: 'Green Salad', emoji: '🥗', category: EmojiCategory.food },
	{ name: 'Potable Water', emoji: '🚰', category: EmojiCategory.food },
	{ name: 'Red Apple', emoji: '🍎', category: EmojiCategory.food },

	{ name: 'Toothbrush', emoji: '🪥', category: EmojiCategory.life },

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
