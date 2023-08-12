import { loggedIn } from './stores';

export type AuthToken = {
	username: string;
	auth_token: string;
};

export function login(token: AuthToken) {
	localStorage.setItem('username', token.username);
	localStorage.setItem('key', token.auth_token);
	loggedIn.set(true);
}

export function logout() {
	localStorage.removeItem('username');
	localStorage.removeItem('key');
	loggedIn.set(false);
}
