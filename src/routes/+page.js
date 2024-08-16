/** @type {import('./$types').PageLoad} */
import { goto } from '$app/navigation';

export async function load({parent}) {
   let {session} = await parent()

    if (session) {
      // Redirect to dashboard if the user is already logged in
      throw goto('/dashboard');
    }

    return {};
};