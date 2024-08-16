/** @type {import('./$types').PageLoad} */
import { supabase } from "$lib/supabase";

export async function load({depends}) {
    depends('blogs:all');

  const { data: blogs, error } = await supabase.from("blogs").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching blogs:", error);
    return { blogs: [] };
  }

  return { blogs, user };
}
