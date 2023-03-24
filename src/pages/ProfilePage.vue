<script setup>
defineProps(["user-obj", "isAuthenticated"]);
defineEmits(["update:challenge-obj"]);
</script>
<script>
export default {
  name: "ProfilePage",
};
</script>

<template>
  <div>
    <h2 style="margin-left: 16px">Profile</h2>
  </div>
  <div id="mainpage-content">
    <div id="profile" v-if="isAuthenticated">
      <div id="profile__top">
        <div id="profile__top__left">
          <img :src="userObj.avatar" alt="" />
        </div>
        <div id="profile__top__right">
          <span id="profile__top__right__name">{{ userObj.name }}</span>
          <span>{{ userObj.email }}</span>
        </div>
      </div>
      <RouterLink to="/account" style="width: 100%;max-width: 512px;"
        ><button style="width: 100%">Account</button></RouterLink
      >
    </div>
    <div id="non-auth" v-if="!isAuthenticated">
      <RouterLink to="/account">Auth to see</RouterLink>
    </div>
  </div>
</template>
<style scoped>
#mainpage-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}
#profile {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
}
#profile__top {
  width: 100%;
  display: flex;
  flex-direction: row;
}
#profile__top__left {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  margin-right: 16px;
}
#profile__top__left img {
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 50%;
}
#profile__top__right {
  width: 100%;
  display: flex;
  flex-direction: column;
}
#profile__top__right__name {
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  line-height: 32px;
}
@media screen and (max-width: 768px) {
}
</style>
