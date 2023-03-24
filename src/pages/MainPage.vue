<script setup>
defineProps([
  "productsArr",
  "likedProducts",
  "challenges",
  "userObj",
  "leaveChallenge",
  "enrollChallenge",
  "challengeFinishTime",
  "routeToMeters",
]);
defineEmits(["update:productsArr"]);
</script>
<script>
export default {
  computed: {
    hasChallengeStarted() {
      return (
        this.selectedChallenge().time >= Math.round(Date.now() / 1000) &&
        this.selectedChallenge().time < Math.round(Date.now() / 1000)
      );
    },
    epochTime() {
      return Math.round(Date.now() / 1000);
    },
  },
};
</script>
<template>
  <div>
    <h2 style="margin-left: 16px">Activities</h2>
  </div>
  <div id="mainpage-content">
    <aside>
      <ul id="mainpage-content__upcoming">
        <li
          v-for="challenge in userObj.participated.sort((a1, a2) =>
            challengeFinishTime(a1) >= challengeFinishTime(a2) ? 1 : -1
          )"
        >
          <RouterLink :to="'/challenge/' + challenge.id">
            <div class="mainpage-content__upcoming__elem__photo">
              <img :src="challenge.image_square" alt="" />
            </div>
            <div class="mainpage-content__upcoming__elem__info">
              <span class="mainpage-content__upcoming__elem__name">{{
                challenge.cname
              }}</span>
              <div class="mainpage-content__upcoming__elem__info__time">
                <svg class="mainpage-content__upcoming__elem__info__time__icon">
                  <use :xlink:href="'/src/assets/icons.svg?005#time-outline'" />
                </svg>
                <span
                  class="mainpage-content__upcoming__elem__info__time__value"
                  >{{
                    challenge.starts > epochTime
                      ? "Starts in"
                      : challengeFinishTime(challenge) > epochTime
                      ? "Ends in"
                      : "Finished"
                  }}
                  {{
                    challenge.starts > epochTime
                      ? challenge.starts - epochTime
                      : challengeFinishTime(challenge) > epochTime
                      ? challengeFinishTime(challenge) - epochTime
                      : epochTime - challengeFinishTime(challenge)
                  }}
                  seconds</span
                >
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </aside>
    <main>
      <ul id="activity-list">
        <li
          v-for="(challenge, index) in challenges"
          class="activity-list__elem"
        >
          <RouterLink :to="'/challenge/' + challenge.id">
            <div class="activity-list__elem__photo">
              <img
                :src="index == 0 ? challenge.image : challenge.image_square"
                alt=""
              />
            </div>
            <div class="activity-list__elem__head">
              <div class="activity-list__elem__head__icon">
                <svg>
                  <use
                    :xlink:href="
                      '/src/assets/icons.svg?005#' +
                      (challenge.sport_type == 'cycling'
                        ? 'bike-outline'
                        : 'walk-outline')
                    "
                  />
                </svg>
              </div>
              <span class="activity-list__elem__head__name">{{
                challenge.cname
              }}</span>
            </div>
            <div class="activity-list__elem__info">
              <ul class="activity-list__elem__info__data">
                <li class="activity-list__elem__info__data__elem">
                  <svg class="activity-list__elem__info__data__elem__icon">
                    <use
                      xlink:href="/src/assets/icons.svg?005#analytics-outline"
                    />
                  </svg>
                  <span class="activity-list__elem__info__data__elem__value">{{
                    challenge.ctype == "daily"
                      ? challenge.distance + " m"
                      : routeToMeters(challenge.coordinates) + " m"
                  }}</span>
                </li>
                <li class="activity-list__elem__info__data__elem">
                  <svg class="activity-list__elem__info__data__elem__icon">
                    <use
                      :xlink:href="
                        '/src/assets/icons.svg?005#' +
                        (challenge.ctype == 'daily'
                          ? 'time-outline'
                          : 'location-outline')
                      "
                    />
                  </svg>
                  <span class="activity-list__elem__info__data__elem__value">{{
                    challenge.ctype == "daily"
                      ? challenge.longs + " days"
                      : "Vilnius"
                  }}</span>
                </li>
              </ul>
              <div class="activity-list__elem__buttons">
                <button
                  v-if="
                    !userObj.participated.find((el) => el.id == challenge.id)
                  "
                  @click.prevent="enrollChallenge(challenge.id)"
                >
                  Participate
                </button>
                <button
                  v-if="
                    userObj.participated.find((el) => el.id == challenge.id)
                  "
                  @click.prevent="leaveChallenge(challenge.id)"
                >
                  Leave
                </button>
              </div>
            </div>
          </RouterLink>
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
#mainpage-content__upcoming {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  list-style: none;
  padding: 0;
  overflow-x: hidden;
  overflow-y: visible;
}
#mainpage-content__upcoming li {
  width: 256px;
  height: 64px;
  padding: 8px;
  background: #7b93ff;
  border-radius: 8px;
  margin: 6px 0;
  flex-shrink: 0;
}
#mainpage-content__upcoming li a {
  display: flex;
  flex-direction: row;
  color: #fff;
}
.mainpage-content__upcoming__elem__photo {
  width: 48px;
  height: 48px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 4px;
}
.mainpage-content__upcoming__elem__photo img {
  width: 100%;
  height: 100%;
}
.mainpage-content__upcoming__elem__info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
}
.mainpage-content__upcoming__elem__info__time {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}
.mainpage-content__upcoming__elem__info__time__icon {
  width: 18px;
  height: 18px;
}
.mainpage-content__upcoming__elem__name {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
}
.mainpage-content__upcoming__elem__starts-in {
  word-wrap: none;
}
#activity-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  list-style: none;
  gap: 8px;
}
.activity-list__elem {
  width: calc(100% - 32px);
  height: auto;
  max-height: 330px;
  padding: 0;
  margin: 0 16px;
}
.activity-list__elem a {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #7b93ff;
  border-radius: 16px;
}
.activity-list__elem__photo {
  width: 100%;
  max-width: 320px;
  height: auto;
  max-height: 180px;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: 14px;
  aspect-ratio: 16/9;
}
#activity-main .activity-list__elem__photo {
  width: 327px;
  height: 195px;
}
.activity-list__elem__photo img {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}
.activity-list__elem__head {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 8px;
}
.activity-list__elem__head__icon {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f8ff;
  border-radius: 12px;
  margin-right: 12px;
  flex-shrink: 0;
  color: #6e88ff;
}
.activity-list__elem__head__icon svg {
  width: 24px;
  height: 24px;
}
.activity-list__elem__head__name {
  color: #fff;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 48px;
  vertical-align: middle;
}
.activity-list__elem__info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  margin-left: 16px;
}
.activity-list__elem__info__data {
  width: 100%;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  color: #fff;
  margin-top: 6px;
}
.activity-list__elem__info__data__elem {
  width: 100%;
  height: 24px;
  display: flex;
  flex-direction: row;
  padding: 0;
}
.activity-list__elem__info__data__elem__icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}
.activity-list__elem__buttons {
  flex-shrink: 0;
}
.activity-list__elem__buttons button {
  height: 48px;
  padding: 0 32px;
  background: #f7f8ff;
  border-radius: 12px;
  border: none;
  color: #6e88ff;
}
@media screen and (max-width: 1372px) {
  .activity-list__elem a {
    flex-direction: column;
  }
}
@media screen and (max-width: 768px) {
  aside {
    width: 100%;
  }
  #mainpage-content {
    display: flex;
    flex-direction: column;
  }
  #mainpage-content__upcoming {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }

  #mainpage-content__upcoming li {
    width: 262px;
    margin: 0 6px;
  }
  #activity-main a {
    flex-direction: column;
  }
  #activity-main .activity-list__elem__info {
    margin: 12px 0 8px 0;
  }
  .activity-list__elem {
    padding: 12px;
  }
}
</style>
