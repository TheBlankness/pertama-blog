<script>
  import "../app.css";
  import { supabase } from '$lib/supabase';
  import { writable } from "svelte/store";
  import { goto } from '$app/navigation';
  import { onMount } from "svelte";

  export let data;

  const user = writable(data.session);

  onMount(async () => {

    supabase.auth.onAuthStateChange((_event, session) => {
      user.set(session?.user || null);
    });
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    user.set(null);
    goto("/");
  };
</script>

<nav class="bg-blue-600 text-white shadow-md">
  <div class="container mx-auto px-4 py-3 flex justify-between items-center">
    <!-- Logo/Brand -->
    <div class="text-lg font-bold">
      <a href="/" class="hover:text-gray-200">JomSocial</a>
    </div>

    <!-- Links -->
    <div class="space-x-4">
      <a href="/dashboard" class="hover:text-gray-200">Blogs</a>
      {#if $user}
      <button on:click={handleSignOut} class="hover:text-gray-200">Sign Out</button>
    {:else}
      <a href="/" class="hover:text-gray-200">Login</a>
      <a href="/signup" class="hover:text-gray-200">Sign Up</a>
    {/if}
    </div>
  </div>
</nav>

<slot />
