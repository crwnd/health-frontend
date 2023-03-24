<script setup>
defineProps(["modelValue", "user-obj", "isAuthenticated"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <header>
    <div id="header_main">
      <div id="header__main__left">
        <RouterLink to="/" id="logo-elem">
          <img src="/src/assets/logo.png" alt="logo" />
          <div id="logo-elem-right">
            <span id="logo-text">MobilePay</span>
            <span id="logo-subtext">Health corner</span>
          </div>
        </RouterLink>
      </div>
      <div id="header__main__center"></div>
      <div id="header__main__right">
        <button
          class="header__btns"
          @click="
            {
              $emit('update:editing-challenge', -1);
              $emit('update:modelValue', 'createChallenge');
            }
          "
          v-if="userObj.admin"
        >
          <svg>
            <use xlink:href="/src/assets/icons.svg?005#add-outline"></use>
          </svg>
        </button>
        <button
          id="header__profile"
          class="hides-on-mobile"
          v-if="isAuthenticated"
          @click="$emit('update:modelValue', 'modalMenu')"
        >
          <div id="header__profile__left">
            <div id="header__profile__left__avatar">
              <img src="/static/user-avatars/trykhin2004.jpg" alt="" />
            </div>
            <span id="header__profile__left__name">{{ userObj.name }}</span>
          </div>
          <div id="header__profile__right">
            <svg>
              <use xlink:href="/src/assets/icons.svg?005#chevron-down"></use>
            </svg>
          </div>
        </button>
        <button
          id="header__auth"
          class="hides-on-mobile"
          v-if="!isAuthenticated"
        >
          <RouterLink to="/account">Auth</RouterLink>
        </button>
      </div>
    </div>
    <div id="header_sec"></div>
  </header>
</template>

<style scoped>
header {
  top: 0;
  left: 0;
  /* right: 0; */
  height: 72px;
  width: 100%;
  padding: 16px;
  /* position: relative; */
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--header-bg-color);
  z-index: 100;
  transition: 0.2s height;
}

header img {
  height: 40px;
  width: 40px;
  display: inline-flex;
  margin-right: 8px;
}

#header_main,
#header_secondary {
  height: 100%;
  width: 100%;
  max-width: 1600px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

#header__main__left,
#header__main__center,
#header__main__right {
  max-height: 100%;
  width: calc(100% / 3);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
#header__main__center {
  justify-content: center;
}
#header__main__right {
  justify-content: flex-end;
}

button {
  height: 45px;
  min-width: 45px;
  /* display: flex; */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 6px;
  cursor: pointer;
  background-color: var(--btns-bg);
  /* border: 1px solid var(--btns-border-color); */
  border: none;
  color: var(--text-color);
  flex-shrink: 0;
  /* box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px; */
  box-shadow: none;
}
button:hover {
  background-color: var(--tabs-bg-hover);
}
.header__btns {
  padding: 0;
  width: auto;
}
.header__btns svg,
.header__btns img {
  width: 24px;
  height: 24px;
  fill: #595959;
}

#logo-elem {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Quicksand SemiBold";
  position: relative;
  font-size: 24px;
}

#logo-elem-right {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

#logo-text {
  font-size: 24px;
  /* color: #595959; */
  color: var(--text-color);
}

#logo-subtext {
  font-size: 12px;
  color: #595959;
  margin-top: -15px;
  line-height: 15px;
  transform: translateY(14px);
}
#header-catalog-btn {
  margin-left: 12px;
  padding: 0 12px;
}
#header-catalog-btn svg {
  margin-right: 8px;
}
/* #header__auth {
} */
#header__auth a {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}
#header__profile {
  width: 100%;
  max-width: 178px;
  min-width: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px 0 8px;
  border: none;
  background: none;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: none;
}
#header__profile:hover {
  background-color: var(--tabs-bg-hover);
}
#header__profile__left {
  width: calc(100% - 24px - 12px);
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
#header__profile__left__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 8px;
}
#header__profile__left__avatar img {
  width: 100%;
  height: 100%;
}
#header__profile__left__name {
  width: 100%;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
}
#header__profile__right {
  width: 24px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  margin-left: 12px;
}
#header__profile__right svg {
  width: 18px;
  height: 18px;
}

@media screen and (max-width: 1600px) {
  #header__main__left,
  #header__main__center {
    width: 50%;
  }

  #header__main__center {
    justify-content: flex-end;
  }
}
@media screen and (max-width: 768px) {
  header {
    height: 60px;
    padding: 7.5px;
  }
  #header-catalog-btn {
    display: none;
  }
  #header__main__right {
    display: flex;
  }
  #header__main__left,
  #header__main__right {
    width: auto;
  }
  #header__main__center {
    width: 100%;
    justify-content: center;
  }
  #content.search-opened #header__main__left,
  #content.search-opened #header__main__right {
    display: none;
  }

  #content.search-opened #header__main__center {
    width: 100%;
    justify-content: center;
  }
  #content.search-opened #search {
    max-width: 100%;
    width: 100%;
  }
  #logo-elem span {
    /* display: none; */
  }

  #header__main__right .open-orders {
    display: none;
  }
  #header-hamburger {
    display: none;
  }
}
</style>
