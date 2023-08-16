import { latestVersion } from '$lib/versions';
import { json } from '@sveltejs/kit';

export function GET() {
	return json(latestVersion().version);
}
