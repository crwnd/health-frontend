<script setup>
defineProps(["modelValue", "isAuthenticated", "logoutFunction"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div
    id="modal-menu-window"
    :class="{ hidden: modelValue !== 'modalMenu' }"
    @click="$emit('update:modelValue', undefined)"
  >
    <div id="modal-menu" class="authed" @click.stop="">
      <RouterLink to="/profile" id="modal-menu__user" class="hides-on-mobile">
        <div id="modal-menu__user__avatar">
          <img
            src="/src/assets/icons.svg?005#person-circle-outline"
            alt="avatar"
          />
          <div class="avatar-icon">
            <svg>
              <use xlink:href="/src/assets/icons.svg?005#locked-outline"></use>
            </svg>
          </div>
        </div>
        <div id="modal-menu__user__info">
          <span id="modal-menu__user__name">User name</span>
          <span id="modal-menu__user__email">hello@lowsoft.ml</span>
        </div>
      </RouterLink>
      <RouterLink id="modal-menu__action-banner" to="/specials/something.html">
        <span id="modal-menu__action-banner__text">Action!</span>
      </RouterLink>
      <ul>
        <li @click="$emit('update:modelValue', undefined)">
          <RouterLink to="/" exact-active-class="active" active-class="active">
            <svg class="modal-menu__icon__outline">
              <use xlink:href="/src/assets/icons.svg?005#home-outline"></use>
            </svg>
            <svg class="modal-menu__icon__filled">
              <use xlink:href="/src/assets/icons.svg?005#home-filled"></use>
            </svg>
            <span>Home</span>
          </RouterLink>
        </li>
        <li
          id="modal-menu__cabinet"
          class="modal-opener open-cabinet"
          data-modal_id="modal-cabinet-window"
        >
          <RouterLink
            to="/stats"
            @click="$emit('update:modelValue', undefined)"
            active-class="active"
          >
            <svg class="modal-menu__icon__outline">
              <use
                xlink:href="/src/assets/icons.svg?005#stats-chart-outline"
              ></use>
            </svg>
            <svg class="modal-menu__icon__filled">
              <use
                xlink:href="/src/assets/icons.svg?005#stats-chart-filled"
              ></use>
            </svg>
            <span>Stats</span>
          </RouterLink>
        </li>
        <li
          id="modal-menu__cabinet"
          class="modal-opener open-cabinet"
          data-modal_id="modal-cabinet-window"
        >
          <RouterLink
            to="/profile"
            @click="$emit('update:modelValue', undefined)"
            active-class="active"
          >
            <svg class="modal-menu__icon__outline">
              <use xlink:href="/src/assets/icons.svg?005#person-outline"></use>
            </svg>
            <svg class="modal-menu__icon__filled">
              <use xlink:href="/src/assets/icons.svg?005#person-filled"></use>
            </svg>
            <span>Profile</span>
          </RouterLink>
        </li>
        <li
          class="hides-on-mobile"
          id="modal-menu__logout"
          v-if="isAuthenticated"
          @click="
            {
              logoutFunction();
              $emit('update:modelValue', undefined);
            }
          "
        >
          <a>
            <svg>
              <use xlink:href="/src/assets/icons.svg?005#logout-outline"></use>
            </svg>
            <span>Exit</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
#modal-menu-window {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  visibility: visible;
  pointer-events: all;
  user-select: auto;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 110;
  opacity: 1;
  transition: opacity 0.2s, visibility 0.2s;
}
#modal-menu-window.hidden {
  visibility: hidden;
  pointer-events: none;
  user-select: none;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
}

#modal-menu {
  width: 300px;
  max-height: calc(100% - 124px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: inherit;
  position: fixed;
  transform: translateY(0px);
  top: 104px;
  right: calc(calc(100% - 1600px) / 2);

  /* background-color: #f4f6fa; */
  background-color: var(--bottom-nav-bg);
  color: var(--bottom-nav-text);
  /* border-radius: 20px; */
  border-radius: 16px;
  z-index: 111;
  visibility: inherit;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  transition: top 0.2s, transform 0.2s;
}
#modal-menu-window.hidden #modal-menu {
  transform: translateY(-50px);
  transition: top 0.2s, transform 0.2s;
}

#modal-menu__user {
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-color);
}

#modal-menu__user__email {
  font-size: 12px;
  /* color: #464646; */
  color: var(--text-color);
}

#modal-menu__user__avatar {
  width: 40px;
  height: 40px;
  margin-right: 16px;
  position: relative;
}

#modal-menu__user__avatar > svg,
#modal-menu__user__avatar > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: -5px;
  right: -5px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #4a4e5b;
  border: 3px solid #fff;
  color: #fff;
}

.avatar-icon svg {
  width: 70%;
  height: 70%;
}

#modal-menu__user__info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

#modal-menu__action-banner {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #c3ffa1, #90ffdd);
}

#modal-menu > ul {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin: 0;
  user-select: none;
}

#modal-menu > ul > li {
  width: 100%;
  height: 48px; /*56px;*/
  /* margin-top: 4px; */
  background-color: inherit;
  /* transition: all 0.2s; */
}

#modal-menu ul a.active:not(.activeOverwrite) {
  color: var(--accent-color);
  fill: var(--accent-color);
  font-weight: bold;
  /* transition: all 0.2s; */
}

#modal-menu ul a.active:not(.activeOverwrite) .modal-menu__icon__outline,
#modal-menu ul a .modal-menu__icon__filled {
  display: none;
}

#modal-menu ul a .modal-menu__icon__outline,
#modal-menu ul a.active:not(.activeOverwrite) .modal-menu__icon__filled {
  display: block;
}

#modal-menu ul li:hover {
  background-color: var(--modal-menu-hover-bg);
  transition: all 0.2s;
}

#modal-menu ul a {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 16px;
  color: var(--text-color);
}

#modal-menu ul a svg,
#modal-menu ul a > img {
  width: 36px;
  height: 36px;
  padding: 6px;
  /* background: #fff; */
  /* border-radius: 50%; */
  /* overflow: visible; */
  margin-right: 12px;
}

@media screen and (max-width: 1600px) {
  #modal-menu {
    right: 16px;
  }
}
@media screen and (max-width: 1024px) {
  #modal-menu {
    width: 80%;
    max-height: calc(100% - 100px);
    max-width: 320px;
    height: 100%;
    padding: 0;
    left: 0;
    /* top: 72px; */
    transform: translateX(0);
    border-radius: 0;
    justify-content: flex-start;
  }

  #modal-menu-window.hidden #modal-menu {
    transform: translateX(-50%);
  }
}
@media screen and (max-width: 768px) {
  /* #modal-menu-window #modal-menu .hides-on-mobile,
  #modal-menu.authed #modal-menu__user {
    display: none;
  } */

  #modal-menu-window {
    width: 100%;
    max-width: 100%;
    height: 58px;
    top: auto;
    bottom: 0;
  }

  #modal-menu {
    width: 100%;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    flex-direction: row;
    position: relative;
    margin: 0;
    padding: 0 20px;
    top: 0;
    left: 0;
    border-radius: 0;
    visibility: visible;
    pointer-events: all;
  }

  #modal-menu__action-banner,
  #modal-menu__user {
    display: none;
  }

  #modal-menu > ul {
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  #modal-menu > ul > li {
    width: 100%;
    height: 100%;
    flex-direction: column;
    margin: 0;
    padding: 0;
    overflow-y: hidden;
  }

  #modal-menu > ul > li:hover {
    background-color: inherit;
  }

  #modal-menu > ul > li > a {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    padding: 0;
    color: #707f8d;
  }

  #modal-menu > ul > li > a > span {
    margin-top: 5px;
    font-size: 11px;
  }

  #modal-menu > ul > li > a > svg,
  #modal-menu > ul > li > a > img {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin: 0;
    padding: 0;
  }

  #modal-menu-window,
  #modal-menu-window.hidden {
    z-index: 110;
  }

  #modal-menu-window.hidden {
    visibility: visible;
    pointer-events: all;
    transform: none;
    opacity: 1;
  }
  #modal-menu-window.hidden #modal-menu {
    transform: none;
  }
}
@media screen and (max-width: 480px) {
  #modal-menu-window {
    width: 100%;
    max-width: 100%;
  }
  #modal-menu {
    padding: 0;
  }
}
</style>
