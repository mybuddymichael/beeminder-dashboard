export enum EmojiCategory {
	exercise,
	food,
	reading,
	faith
}

export type EmojiObject = {
	name: string;
	emoji: string;
	category: EmojiCategory;
};

export const emoji: EmojiObject[] = [
	{ name: 'Person Lifting Weights', emoji: '🏋️', category: EmojiCategory.exercise },
	{ name: 'Person Running', emoji: '🏃', category: EmojiCategory.exercise },
	{ name: 'Running Shoe', emoji: '👟', category: EmojiCategory.exercise },

	{ name: 'Red Apple', emoji: '🍎', category: EmojiCategory.food },
	{ name: 'Carrot', emoji: '🥕', category: EmojiCategory.food },
	{ name: 'Green Salad', emoji: '🥗', category: EmojiCategory.food },

	{ name: 'Open Book', emoji: '📖', category: EmojiCategory.reading },
	{ name: 'Closed Book', emoji: '📕', category: EmojiCategory.reading },
	{ name: 'Books', emoji: '📚', category: EmojiCategory.reading }
];
