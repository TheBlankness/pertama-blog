<script>
    import { supabase } from '$lib/supabase';
    import { invalidate } from '$app/navigation';
  
    /** @type {import('./$types').PageData} */
    export let data;
  
    let showcreating = false

    // Form data for new blog
    let newBlog = {
      title: '',
      description: '',
      author: data?.username?.name,
      image: ''
    };
  
    let addingBlog = false;
  
    const addBlog = async () => {
      if (!newBlog.title || !newBlog.description) return;
  
      addingBlog = true;
  
      const { error } = await supabase
        .from('blogs')
        .insert([newBlog]);
  
      if (error) {
        console.error('Error adding blog:', error);
        addingBlog = false;
        return;
      }
  
      // Refresh the page data to include the new blog
       invalidate('blogs:all');
      newBlog = {
        title: '',
        description: '',
        author: data?.username?.name,
        image: ''
      };
      addingBlog = false;
    };
  </script>
  
  <div class="container mx-auto min-h-screen p-8">
    {#if data.session}
      <h1 class="text-3xl font-bold mb-6">Welcome {data?.username?.name}</h1>
    {/if}
  
  <div class="flex flex-row mb-3">
    <h1 class="text-3xl font-bold mr-3">Blogs</h1>
  
    <button  class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" on:click={()=>{showcreating=!showcreating}}>
        
        {showcreating ? 'Hide' : 'Show'} Create</button>

  </div>
    <!-- Add New Blog Section -->
    {#if data.session && showcreating}
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-semibold mb-4">Add a New Blog</h2>
      <div class="mb-4">
        <input
          type="text"
          bind:value={newBlog.title}
          placeholder="Blog Title"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4">
        <textarea
          bind:value={newBlog.description}
          placeholder="Blog Description"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
      </div>
      <div class="mb-4">
        <input
          type="text"
          bind:value={newBlog.image}
          placeholder="Image URL (optional)"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        on:click={addBlog}
        class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={addingBlog}
      >
        {#if addingBlog}
          Adding Blog...
        {:else}
          Add Blog
        {/if}
      </button>
    </div>
    {/if}
  
    <!-- Display Blogs -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each data.blogs as blog}
        <a href="/blog/{blog.id}" class="bg-white p-4 rounded-lg shadow-md">
          {#if blog.image}
            <img
              src={blog.image}
              alt={blog.title}
              class="w-full h-40 object-cover rounded-t-lg mb-4"
            />
          {/if}
          <p class="text-3xl font-semibold mb-2">{blog.title}</p>
          <p class="text-gray-700 mb-4">{blog.description}</p>
          <p class="text-sm text-gray-500">By {blog.author}</p>
        </a>
      {/each}
    </div>
  </div>
  