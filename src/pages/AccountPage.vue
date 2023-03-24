<script setup>
import AccountOverview from "../views/AccountPageOverview.vue";
import AccountExternalLinks from "../views/AccountPageExternalLinks.vue";
import AccountPersonal from "../views/AccountPagePersonal.vue";
import AccountSecurity from "../views/AccountPageSecurity.vue";
defineProps([
  "productsArr",
  "likedProducts",
  "signin-function",
  "signup-function",
  "logout-function",
  "unlink-strava",
  "is-authenticated",
  "user-obj",
]);
defineEmits(["update:productsArr"]);
</script>

<script>
export default {
  name: "AccountPage",
  components: {
    AccountOverview,
    AccountExternalLinks,
    AccountPersonal,
    AccountSecurity,
  },
  data() {
    return {
      registerView: false,
      activeTab: "",
      tabsObj: [
        { visibleName: "Overview", svg: "person", url: "" },
        { visibleName: "Externals", svg: "box", url: "/external-links" },
        { visibleName: "Personal data", svg: "fingerprint", url: "/personal" },
        { visibleName: "Security", svg: "shield", url: "/security" },
      ],
    };
  },
  computed: {
    productObj() {
      let activeProdId = this.$route.params.productid;
      return this.productsArr.find((prod) => prod.id == activeProdId);
    },
  },
  methods: {
    updateUserObj(newValue) {
      this.userObj = newValue;
    },
    toggleTheme() {
      switch (localStorage.getItem("theme")) {
        case "dark":
          localStorage.removeItem("theme");
          document.body.classList.remove("dark");
          break;
        case "light":
          localStorage.setItem("theme", "dark");
          document.body.classList.remove("light");
          document.body.classList.add("dark");
          break;
        default:
          localStorage.setItem("theme", "light");
          document.body.classList.remove("dark");
          document.body.classList.add("light");
      }
    },
  },
  created() {
    this.activeTab = this.$route.params.tab || "";
  },
};
</script>

<template>
  <div id="account-content" v-if="isAuthenticated === true">
    <aside>
      <ul id="account-section-tabs">
        <li v-for="tabItem in tabsObj" class="account-section-tab">
          <RouterLink
            :to="'/account' + tabItem.url"
            exact-active-class="active"
            active-class="active"
          >
            <div class="account-section-tab__content">
              <div class="account-section-tab__content__left">
                <div class="svg-holder">
                  <svg class="onactive">
                    <use
                      :xlink:href="
                        '/src/assets/icons.svg?005#' + tabItem.svg + '-filled'
                      "
                    />
                  </svg>
                  <svg class="nonactive">
                    <use
                      :xlink:href="
                        '/src/assets/icons.svg?005#' + tabItem.svg + '-outline'
                      "
                    />
                  </svg>
                </div>
                <span>{{ tabItem.visibleName }}</span>
              </div>
              <div class="account-section-tab__content__right"></div>
            </div>
          </RouterLink>
        </li>
        <li class="account-section-tab" @click="toggleTheme">
          <a>
            <div class="account-section-tab__content">
              <div class="account-section-tab__content__left">
                <div class="svg-holder">
                  <svg class="onactive">
                    <use
                      :xlink:href="'/src/assets/icons.svg?005#moon-filled'"
                    />
                  </svg>
                  <svg class="nonactive">
                    <use
                      :xlink:href="'/src/assets/icons.svg?005#moon-outline'"
                    />
                  </svg>
                </div>
                <span>Toggle theme</span>
              </div>
              <div class="account-section-tab__right">
                <span id="account-theme-label" class="onDarkTheme">dark</span>
                <span id="account-theme-label" class="onLightTheme">light</span>
                <span id="account-theme-label" class="onAutoTheme">auto</span>
              </div>
            </div>
          </a>
        </li>
        <li class="account-section-tab" @click="logoutFunction">
          <a>
            <div class="account-section-tab__content">
              <div class="account-section-tab__content__left">
                <div class="svg-holder">
                  <svg class="onactive">
                    <use
                      :xlink:href="'/src/assets/icons.svg?005#logout-filled'"
                    />
                  </svg>
                  <svg class="nonactive">
                    <use
                      :xlink:href="'/src/assets/icons.svg?005#logout-outline'"
                    />
                  </svg>
                </div>
                <span>Logout</span>
              </div>
              <div class="account-section-tab__right"></div>
            </div>
          </a>
        </li>
      </ul>
    </aside>
    <main id="account-section-holder">
      <RouterView
        :user-obj="userObj"
        :unlink-strava="unlinkStrava"
        @update:user-obj="updateUserObj"
      />
    </main>
  </div>
  <div id="auth-content" v-if="isAuthenticated !== true">
    <form @submit.prevent="signinFunction" v-if="!registerView">
      <div class="main-form">
        <span class="auth-title">Login</span>
        <input name="email" type="email" placeholder="Email" />
        <input name="pass" type="password" placeholder="Password" />
        <span @click="registerView = true"
          >Don’t have an account? <u>Register</u></span
        >
      </div>
      <div class="bottom-btn">
        <button type="submit">Log in</button>
      </div>
    </form>
    <form @submit.prevent="signupFunction" v-if="registerView">
      <div class="main-form">
        <span class="auth-title">Register</span>
        <input name="name" type="name" placeholder="Name" />
        <input name="email" type="email" placeholder="Email" />
        <input name="pass" type="password" placeholder="Password" />
        <span @click="registerView = false"
          >Already registered? <u>Login</u></span
        >
      </div>
      <div class="bottom-btn">
        <button type="submit">Sign up</button>
      </div>
    </form>
  </div>
</template>

<style>
#account-content,
#auth-content {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
}
#auth-content {
  flex-direction: column;
  padding-bottom: 56px;
}
#account-section-holder {
  padding: 8px;
}
aside {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
main {
  width: 100%;
}
#account-section-tabs {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-shrink: 0;
  position: sticky;
  top: 72px;
  background: var(--main-bg-color);
  z-index: 100;
  list-style: none;
}

.account-section-tab {
  width: 100%;
  height: 48px;
  display: block;
  flex-shrink: 0;
  font-size: 0.9rem;
  overflow: hidden;
}
.account-section-tab a {
  width: 100%;
  height: 100%;
  display: block;
  padding: 2px 0;
  position: relative;
}
.account-section-tab__content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  color: var(--tabs-color);
  border-radius: 6px;
}
.account-section-tab a:hover .account-section-tab__content {
  background-color: var(--tabs-bg-hover);
}
.account-section-tab__content__left {
  width: auto;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.account-section-tab .svg-holder {
  width: 24px;
  height: 24px;
  display: block;
  flex-shrink: 0;
  margin-right: 12px;
}
.account-section-tab svg {
  width: 100%;
  height: 100%;
  color: inherit;
}
.account-section-tab svg.onactive,
.account-section-tab a.active svg.nonactive {
  display: none;
}

.account-section-tab a.active .account-section-tab__content {
  /* border-bottom: 2px solid #005bff; */
  background-color: #464a4c;
  color: #fff;
  text-decoration: none;
}
.account-section-tab a.active svg.onactive,
.account-section-tab svg.nonactive {
  display: block;
}
#auth-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
#auth-content form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
}
#auth-content .main-form,
#auth-content .bottom-btn {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
#auth-content .bottom-btn {
  padding-bottom: 16px;
}
#auth-content input,
#auth-content button {
  height: 48px;
  max-width: 327px;
  width: 100%;
  border-radius: 8px;
  padding: 8px 16px;
  border: 1px solid #e3e5e6;
}
#auth-content button {
  border: none;
  border-radius: 48px;
  background-color: var(--accent-color);
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
}
.auth-title {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 48px;
  vertical-align: middle;
}
@media screen and (min-width: 768px) {
  .account-section-tab a:not(.account-section-tab a.active):hover {
    /* border-bottom: 2px solid #005bff; */
    text-decoration: none;
  }
}
@media screen and (max-width: 768px) {
  #account-section-tabs {
    top: 60px;
  }
  aside {
    width: 48px;
  }
  #account-section-tabs {
    width: 100%;
    padding: 0;
  }
  .account-section-tab {
    height: 48px;
  }
  .account-section-tab a {
    padding: 4px;
  }
  .account-section-tab__content {
    flex-direction: column;
    padding: 0;
  }
  .account-section-tab .svg-holder {
    margin: 0;
  }
  /* .account-section-tab__content__left {
    flex-direction: column;
  }
  .account-section-tab__content__left span {
    font-size: 8px;
    justify-content: center;
    align-items: center;
  } */
  .account-section-tab__content__left span {
    display: none;
  }
  #auth-content form {
    justify-content: space-between;
  }
}
</style>
