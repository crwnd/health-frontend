<script setup>
defineProps([
  "productsArr",
  "user-obj",
  "likedProducts",
  "leaveChallenge",
  "enrollChallenge",
]);
defineEmits(["update:challenge-obj"]);
</script>
<script>
export default {
  name: "ChallengePage",
  components: {},
  data() {
    return {
      dateString:
        new Date().getFullYear() +
        "-" +
        ("0" + (new Date().getMonth() + 1)).slice(-2) +
        "-"+("0" + new Date().getDate()).slice(-2),
      dateHistory: [],
    };
  },
  methods: {
    localDateTimeToTimestamp(localDate, localTime) {
      const dateTimeString = localDate + "T" + localTime;
      const localTimestamp = Date.parse(dateTimeString);
      const unixTimestamp = Math.floor(localTimestamp / 1000);

      return unixTimestamp;
    },
  },
  watch: {
    dateString: async function (val, oldVal) {
      let json = await (
        await fetch("https://api.crwnd.dev/api/get-history-day/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            epoch: this.localDateTimeToTimestamp(val, "00:00:00"),
          }),
        })
      ).json();
      console.log(json);
      if (json.code == 0) {
        this.dateHistory = json.content;
      } else {
        alert(json.message);
      }
    },
  },
};
</script>

<template>
  <div>
    <h2 style="margin-left: 16px">Stats</h2>
  </div>
  <div id="mainpage-content">
    <aside>
      <div id="stats-profile">
        <div id="stats-profile-holder">
          <div id="stats-profile-holder__avatar">
            <img src="/static/user-avatars/trykhin2004.jpg" alt="avatar" />
          </div>
          <div id="stats-profile-holder__info">
            <p>Hello, {{ userObj.name }}</p>
            <!-- <p>
              {{ dateString }}
            </p> -->
          </div>
          <div id="stats-profile-holder__cta">
            <!-- <button id="stats-profile-holder__cta__calendar">
              <svg>
                <use
                  xlink:href="/src/assets/icons.svg?005#calendar-outline"
                ></use>
              </svg>
            </button> -->
            <input
              v-model="dateString"
              type="date"
              name="stats-profile-holder__cta__calendar-input"
              id="stats-profile-holder__cta__calendar-input"
            />
          </div>
        </div>
      </div>
      <div id="stats-overview">
        <p id="stats-overview__name">Last cycling route</p>
        <div id="stats-overview-data">
          <div class="stats-overview-data__elem">
            <p class="stats-overview-data__elem__number">50 KM</p>
            <p class="stats-overview-data__elem__sub">Distance</p>
          </div>
          <div class="stats-overview-data__elem">
            <p class="stats-overview-data__elem__number">50 KM</p>
            <p class="stats-overview-data__elem__sub">Distance</p>
          </div>
          <div class="stats-overview-data__elem">
            <p class="stats-overview-data__elem__number">50 KM</p>
            <p class="stats-overview-data__elem__sub">Distance</p>
          </div>
        </div>
      </div>
    </aside>
    <main>
      <p class="list-text">History for {{ dateString }}</p>
      <ul class="list-list">
        <li class="list-list__elem" v-for="activity in dateHistory">
          <RouterLink to="/challenge/0">
            <div class="list-list__elem__icon">
              <svg>
                <use
                  xlink:href="/src/assets/icons.svg?005#calendar-outline"
                ></use>
              </svg>
            </div>
            <div class="list-list__elem__details">
              <div class="list-list__elem__details__name">
                {{ activity.sport_type }}
              </div>
              <div class="list-list__elem__details__date">
                {{ activity.distance }} m
              </div>
            </div></RouterLink
          >
        </li>
      </ul>
    </main>
  </div>
</template>
<style scoped>
#mainpage-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}
aside,
main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
aside {
  width: 450px;
}
#stats-profile {
  width: 100%;
  display: flex;
  flex-direction: column;
}
#stats-profile-holder {
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 38px;
}
#stats-profile-holder__avatar {
  width: 64px;
  height: 64px;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: 50%;
  margin-right: 16px;
}
#stats-profile-holder__avatar img {
  width: 100%;
  height: 100%;
}
#stats-profile-holder__info {
  width: 100%;
}
#stats-profile-holder__cta__calendar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #fff;
  border: solid 1.5px #eff0f0;
  flex-shrink: 0;
  padding: 0;
}
#stats-profile-holder__cta__calendar svg {
  width: 24px;
  height: 24px;
  color: #4961cd;
}
#stats-overview {
  width: calc(100% - 38px - 38px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px 0;
  background-color: #4961cd;
  border-radius: 30px;
  color: #fff;
  margin: 33px 38px 0 38px;
}
#stats-overview__name {
  width: 100%;
  height: 24px;
  text-align: center;
  line-height: 24px;
  vertical-align: middle;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  margin: 0 0 18px 0;
}
#stats-overview-data {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.stats-overview-data__elem {
  width: calc(100% / 3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
}
.stats-overview-data__elem__number,
.stats-overview-data__elem__sub {
  margin: 0;
}
.stats-overview-data__elem__number {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
}
.list-text {
  height: 28px;
  margin-left: 25px;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
}
.list-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  list-style: none;
  padding: 0 24px;
  gap: 8px;
}
.list-list__elem {
  width: 100%;
  height: 56px;
  background: #7b93ff;
  border-radius: 13px;
}
.list-list__elem a {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  color: #469257;
  padding: 6px 10px;
}
.list-list__elem__icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f5ff;
  color: #4961cd;
  border-radius: 12px;
  margin-right: 12px;
}
.list-list__elem__icon svg {
  width: 24px;
  height: 24px;
}
.list-list__elem__details {
  display: flex;
  flex-direction: column;
}
.list-list__elem__details__name {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
}
.list-list__elem__details__date {
  color: #38344d;
  margin-top: 6px;
}
@media screen and (max-width: 768px) {
  #mainpage-content {
    flex-direction: column;
  }
  aside,
  main {
    width: 100%;
  }
  #stats-profile-holder {
    padding: 0 18px;
  }
  #stats-overview {
    width: calc(100% - 36px);
    margin: 33px 18px 0 18px;
  }
}
</style>
