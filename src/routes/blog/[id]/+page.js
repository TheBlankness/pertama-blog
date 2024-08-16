/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
export async function load({ params,depends }) {
    const { id } = params;
    depends('blog:info');
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

      const { data: comments } = await supabase
      .from('comments')
      .select('*')
      .eq('blogID', id)

    if (fetchError || !blog) {
       error(404, 'Blog not found');
    }

    return { blog, comments };
};