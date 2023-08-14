import { signedIn, username } from './stores';

export type AuthToken = {
	username: string;
	auth_token: string;
};

export function signIn(token: AuthToken) {
	localStorage.setItem('username', token.username);
	localStorage.setItem('key', token.auth_token);
	username.set(token.username);
	signedIn.set(true);
}

export function signOut() {
	localStorage.clear();
	username.set('');
	signedIn.set(false);
}
