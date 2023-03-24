<script setup>
defineProps(["is-authenticated", "user-obj"]);
</script>

<template>
  <RouterLink
    id="page-banner"
    :to="!userObj.has_strava_token ? '/account/external-links' : '/'"
  >
    <span>{{
      !userObj.has_strava_token ? "Link Strava here" : "Nothing new"
    }}</span>
  </RouterLink>
</template>

<style scoped>
#page-banner {
  height: 32px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #000;
  flex-shrink: 0;
}

#page-banner * {
  color: #fff;
}
</style>
