/** @type {import('./$types').LayoutLoad} */
import { supabase } from '$lib/supabase';

export async function load() {
    const { data } = await supabase.auth.getSession();

    const { data: username } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", data.session?.user?.id)
    .single();

    return {session:data.session,username};
}