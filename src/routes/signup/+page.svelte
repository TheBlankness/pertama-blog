<script>
  /** @type {import('./$types').PageData} */
  import { supabase } from "$lib/supabase";
  import { goto, invalidateAll } from "$app/navigation";
  export let data;

  let email = "";
  let password = "";
  let username = "";
  let errorMessage = "";

  const handleSignup = async () => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      errorMessage = error.message;
    } else {
      const { error: errorinseruser } = await supabase.from("users").insert({
        uuid: data.user?.id,
        name: username,
      });
      if (errorinseruser) {
        errorMessage = errorinseruser.message;
      } else {
        invalidateAll()
        goto("/dashboard");
      }
    }
  };
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <h2 class="text-center text-2xl font-bold">Create an Account</h2>
    {#if errorMessage}
      <div class="text-red-500 text-sm">{errorMessage}</div>
    {/if}
    <form on:submit|preventDefault={handleSignup} class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <input
          type="text"
          id="username"
          bind:value={username}
          required
          class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign Up
      </button>
    </form>
    <p class="text-center text-sm text-gray-600">
      Already have an account?
      <a href="/login" class="text-blue-600 hover:underline">Log in here</a>.
    </p>
  </div>
</div>
