<script>
    import { invalidate, goto } from "$app/navigation";
    import { supabase } from "$lib/supabase";
  
    export let data;
  
    let blog = data.blog;
    let newComment = '';
    let addingComment = false;
    let editing = false;
    let updatedBlog = { ...blog };
  
    const addComment = async () => {
      if (!newComment) return;
  
      addingComment = true;
  
      const { error } = await supabase
        .from('comments')
        .insert([{ blogID: blog.id, comment: newComment, owner: data?.username?.name }]);
  
      if (error) {
        console.error('Error adding comment:', error);
        addingComment = false;
        return;
      }
  
      // Refresh the page data to include the new comment
      invalidate('blog:info');
      newComment = '';
      addingComment = false;
    };
  
    const updateBlog = async () => {
      if (!updatedBlog.title || !updatedBlog.description) return;
  
      const { error } = await supabase
        .from('blogs')
        .update({
          title: updatedBlog.title,
          description: updatedBlog.description,
          image: updatedBlog.image
        })
        .eq('id', blog.id);
  
      if (error) {
        console.error('Error updating blog:', error);
        return;
      }
  
      // Refresh the page data to show updated blog
      invalidate('blog:info');
      editing = false;
    };
  
    const deleteBlog = async () => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blog.id);
  
      if (error) {
        console.error('Error deleting blog:', error);
        return;
      }
  
      // Redirect to dashboard after deleting the blog
      await goto('/dashboard');
    };
  </script>
  
  <div class="min-h-screen bg-gray-100 p-8">
    
        <a href="/dashboard" class="text-blue-600 hover:underline">Back to Dashboard</a>

    <div class="mt-6 bg-white p-6 rounded-lg shadow-md">
      {#if data.blog.image}
        <img
          src={data.blog.image}
          alt={data.blog.title}
          class="w-full h-64 object-cover rounded-t-lg mb-4"
        />
      {/if}
  
      {#if editing}
        <!-- Edit Blog Form -->
        <input
          bind:value={updatedBlog.title}
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Blog Title"
        />
        <textarea
          bind:value={updatedBlog.description}
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows="4"
          placeholder="Blog Description"
        ></textarea>
        <input
          bind:value={updatedBlog.image}
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Image URL (optional)"
        />
        <button
          on:click={updateBlog}
          class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
        <button
          on:click={() => (editing = false)}
          class="px-4 py-2 ml-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      {:else}
        <!-- Display Blog Info -->
        <h1 class="text-3xl font-bold mb-4">{data.blog.title}</h1>
        <p class="text-gray-700 mb-6">{data.blog.description}</p>
        <p class="text-sm text-gray-500">By {data.blog.author}</p>
        
        <!-- Edit and Delete Buttons -->
        {#if data.username?.name === data.blog.author}
          <div class="mt-6 flex space-x-4">
            <button
              on:click={() => (editing = true)}
              class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Edit
            </button>
            <button
              on:click={deleteBlog}
              class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        {/if}
      {/if}
  
      <h2 class="mt-6 font-semibold text-gray-800">Comments:</h2>
  
      <!-- Display Comments -->
      <div class="space-y-4 mt-4">
        {#each data.comments as comment}
          <div class="bg-gray-50 p-4 rounded-lg shadow">
            <p class="text-gray-800">{comment.comment}</p>
            <p class="text-sm text-gray-500 mt-2">- {comment.owner}</p>
          </div>
        {/each}
      </div>
  
      <!-- Add New Comment -->
      {#if data.session}
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800">Add a Comment</h3>
          <textarea
            bind:value={newComment}
            class="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Write your comment here..."
          ></textarea>
          <button
            on:click={addComment}
            class="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={addingComment}
          >
            {#if addingComment}
              Adding Comment...
            {:else}
              Add Comment
            {/if}
          </button>
        </div>
      {/if}
  
    </div>
  </div>
  