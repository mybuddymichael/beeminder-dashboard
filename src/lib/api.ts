export type Goal = {
	baremin: string;
	id: string;
	losedate: number;
	pledge: number;
	safebuf: number;
	slug: string;
	title: string;
};

const apiBaseUrl = 'https://www.beeminder.com/api/v1/users/me';
export function userUrl(key: string) {
	return `${apiBaseUrl}.json?auth_token=${key}`;
}
export function goalsUrl(key: string) {
	return `${apiBaseUrl}/goals.json?auth_token=${key}`;
}
