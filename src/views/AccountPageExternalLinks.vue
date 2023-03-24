<script setup>
defineProps([
  "signin-function",
  "signup-function",
  "logout-function",
  "unlink-strava",
  "is-authenticated",
  "user-obj",
]);
</script>
<script></script>
<template>
  <h2>External apps</h2>
  <ul>
    <li>
      <div class="content-left">
        <span>Strava</span>
      </div>
      <div class="content-right">
        <a
          v-if="!userObj.has_strava_token"
          href="https://www.strava.com/oauth/authorize?client_id=104264&redirect_uri=https://api.crwnd.dev/api/strava-link/&response_type=code&approval_prompt=auto&scope=read,read_all,profile:read_all,profile:write,activity:read_all,activity:write"
          >Connect</a
        >
        <button v-if="userObj.has_strava_token" @click="unlinkStrava">
          Disconnect
        </button>
      </div>
    </li>
  </ul>
</template>
