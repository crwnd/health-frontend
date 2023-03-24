<script setup>
import {
  MapboxMap,
  MapboxMarker,
  MapboxNavigationControl,
  MapboxGeolocateControl,
} from "@studiometa/vue-mapbox-gl";
defineProps([
  "userObj",
  "isAuthenticated",
  "likedProducts",
  "challenges",
  "getMiddlePoint",
  "coordinatesToMeters",
  "enrollChallenge",
  "leaveChallenge",
  "epochTime",
]);
defineEmits([
  "update:challenge-obj",
  "update:opened-modal",
  "update:editing-challenge",
]);
</script>
<script>
export default {
  name: "ChallengePage",
  components: {},
  data() {
    return {
      intervalID: -1,
      intervalID1: -1,
    };
  },
  computed: {
    selectedChallenge() {
      let challengeid = this.$route.params.challengeid;
      return (
        this.challenges.find((el) => el.id == challengeid) || {
          coordinates: [],
        }
      );
    },
    hasChallengeStarted() {
      return (
        this.selectedChallenge().time >= Math.round(Date.now() / 1000) &&
        this.selectedChallenge().time < Math.round(Date.now() / 1000)
      );
    },
    toTime(secs) {
      console.log("secs", secs);
      var sec_num = parseInt(secs, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds;
    },
  },
  methods: {
    async requestWithgeo(pos) {
      if (this.selectedChallenge.ctype != "one-time") {
        return;
      }
      if (this.selectedChallenge == undefined) {
        console.info("[requestWithgeo] page hided");
        return;
      }
      const crd = pos.coords;
      let json = await (
        await fetch("https://api.crwnd.dev/api/ping-marathon-location/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            challengeid: this.selectedChallenge.id,
            coordinates: JSON.stringify([crd.longitude, crd.latitude]),
          }),
        })
      ).json();
      console.log(json);
      if (json.code == 0) {
      } else {
        alert(json.message);
      }
    },
    async pollForLocation() {
      if (this.selectedChallenge.ctype != "one-time") {
        return;
      }
      if (this.selectedChallenge == undefined) {
        console.info("[pollForLocations] page hided");
        return;
      }
      // console.log("to start:", this.selectedChallenge.starts - this.epochTime);
      // console.log(
      //   "to end:",
      //   this.selectedChallenge.starts +
      //     this.selectedChallenge.longs -
      //     this.epochTime
      // );
      if (
        this.selectedChallenge.starts < this.epochTime &&
        this.selectedChallenge.starts + this.selectedChallenge.longs >
          this.epochTime &&
        this.selectedChallenge.participants.includes(this.userObj.id)
      ) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.requestWithgeo);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      } else {
        console.log("[pollForLocation] skipping");
      }
    },
    async pollForLocations() {
      if (this.selectedChallenge == undefined) {
        console.info("[pollForLocations] page hided");
        return;
      }
      if (
        this.selectedChallenge.starts < this.epochTime &&
        this.selectedChallenge.starts + this.selectedChallenge.longs >
          this.epochTime &&
        this.selectedChallenge.ctype == "one-time"
      ) {
        let json = await (
          await fetch("https://api.crwnd.dev/api/get-challenge-info/", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              challengeid: this.selectedChallenge.id,
            }),
          })
        ).json();
        if (json.code == 0) {
          this.$emit("update:challenge-obj", json.content);
        } else {
          alert(json.message);
        }
      } else {
        console.log("[pollForLocations] skipping");
      }
    },
    async checkDay(day) {
      let json = await (
        await fetch("https://api.crwnd.dev/api/update-challenge-day/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            challengeid: this.selectedChallenge.id,
            day: parseInt(day) - 1,
          }),
        })
      ).json();
      if (json.code == 0) {
        this.$emit("update:challenge-obj", json.content);
      } else {
        alert(json.message);
      }
    },
    async kickParticipant(userID) {
      let json = await (
        await fetch("https://api.crwnd.dev/api/kick-participant/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            challengeid: parseInt(this.selectedChallenge.id),
            userid: parseInt(userID),
          }),
        })
      ).json();
      if (json.code == 0) {
        this.$emit("update:challenge-obj", json.content);
      } else {
        alert(json.message);
      }
    },
  },
  created() {
    this.intervalID = setInterval(this.pollForLocation, 2000);
    this.intervalID1 = setInterval(this.pollForLocations, 2000);
  },
};
</script>
<template>
  <button class="go-back" @click="$router.go(-1)">
    <svg>
      <use xlink:href="/src/assets/icons.svg?005#arrow-left"></use>
    </svg>
    <span>Go back</span>
  </button>
  <div
    v-if="selectedChallenge.ctype != 'daily'"
    style="height: 40vh; width: 100%; position: sticky; top: 60px"
  >
    <MapboxMap
      style="height: 100%; width: 100%"
      access-token="pk.eyJ1IjoiY3J3bmQiLCJhIjoiY2xmaTQ1Y2NwMDVqbjNvcG41Z2x0d3Y2dCJ9.i0arSZ2VpeDgE6PZXVNUxg"
      map-style="mapbox://styles/mapbox/streets-v11"
      :center="getMiddlePoint(selectedChallenge.coordinates)"
      :zoom="5"
    >
      <MapboxMarker
        v-for="(marker, index) in selectedChallenge.coordinates"
        :lng-lat="marker"
        :key="index"
        :draggable="false"
      >
        <p class="custom-marker">{{ index + 1 }}</p></MapboxMarker
      >
      <MapboxMarker
        v-if="Object.entries(selectedChallenge.participantsData)"
        v-for="(participantData, index) in Object.entries(
          selectedChallenge.participantsData
        ) || []"
        :lng-lat="participantData[1][0]"
        :draggable="false"
      >
        <p class="personOnMap">
          {{ participantData[1][1] }}
        </p>
      </MapboxMarker>
      <MapboxNavigationControl position="bottom-right" showZoom="true" />
      <MapboxGeolocateControl />
    </MapboxMap>
  </div>
  <main :class="selectedChallenge.ctype">
    <div id="challenge-top-info">
      <div id="challenge-top-info__left">
        <span
          @click="
            {
              $emit('update:editing-challenge', selectedChallenge.id);
              $emit('update:opened-modal', 'createChallenge');
            }
          "
          v-if="userObj.admin"
        >
          Change
        </span>
        <h2 style="margin: 0">{{ selectedChallenge.cname }}</h2>
        <p>{{ selectedChallenge.cdesc }}</p>
        <p>
          {{
            selectedChallenge.distance ? selectedChallenge.distance + "m" : ""
          }}
        </p>
      </div>
      <div id="challenge-top-info__right">
        <span v-if="selectedChallenge.ctype != 'daily'">{{
          selectedChallenge.starts > epochTime
            ? "Starts in"
            : selectedChallenge.starts + selectedChallenge.longs > epochTime
            ? "Ends in"
            : "Finished"
        }}</span>
        <span v-if="selectedChallenge.ctype != 'daily'"
          >{{
            selectedChallenge.starts > epochTime
              ? selectedChallenge.starts - epochTime
              : selectedChallenge.starts + selectedChallenge.longs > epochTime
              ? selectedChallenge.starts + selectedChallenge.longs - epochTime
              : epochTime - selectedChallenge.starts - selectedChallenge.longs
          }}
          seconds</span
        >
        <span v-if="selectedChallenge.ctype == 'daily'"
          >{{ selectedChallenge.longs }} days</span
        >
      </div>
    </div>
    <button
      class="participate-button primary"
      v-if="!userObj.participated.find((el) => el.id == selectedChallenge.id)"
      @click.prevent="enrollChallenge(selectedChallenge.id)"
    >
      Participate
    </button>
    <button
      class="participate-button secondary"
      v-if="userObj.participated.find((el) => el.id == selectedChallenge.id)"
      @click.prevent="leaveChallenge(selectedChallenge.id)"
    >
      Leave
    </button>
    <ul v-if="selectedChallenge.ctype != 'daily'" id="markers-list">
      <li
        v-for="(marker, index) in selectedChallenge.coordinates"
        class="markers-list__elem"
      >
        <div class="markers-list__elem__left">
          <div class="markers-list__elem__left__left">
            <svg>
              <use
                xlink:href="/src/assets/icons.svg?005#location-outline"
              ></use>
            </svg>
            <span>{{ 5 * index }} min</span>
          </div>
          <span>{{ index == 0 ? "Start" : "Point " + (index + 1) }}</span>
        </div>
        <div class="markers-list__elem__right">
          <span
            >{{
              index == 0
                ? "0"
                : Math.floor(
                    coordinatesToMeters(
                      selectedChallenge.coordinates[index - 1][1],
                      selectedChallenge.coordinates[index - 1][0],
                      marker[1],
                      marker[0]
                    )
                  )
            }}
            m</span
          >
        </div>
      </li>
    </ul>
    <ul v-if="selectedChallenge.ctype == 'daily'" id="days-list">
      <li
        v-for="day in selectedChallenge.longs"
        :key="day - 1"
        class="days-list__day"
        :class="{
          active:
            selectedChallenge.starts + 24 * 60 * 60 * (day - 1) < epochTime,
        }"
      >
        <div class="days-list__day__left">
          <div class="days-list__day__left__icon">
            <svg>
              <use
                :xlink:href="
                  '/src/assets/icons.svg?005#' +
                  (selectedChallenge.starts + 24 * 60 * 60 * (day - 1) <
                  epochTime
                    ? 'checkmark-circle-outline'
                    : 'caret-forward-circle-outline')
                "
              ></use>
            </svg>
          </div>
          <div class="days-list__day__left__info">
            <span class="days-list__day__left__info__top">Day {{ day }}</span>
            <span class="days-list__day__left__info__sub">{{
              (
                "0" +
                new Date(
                  (selectedChallenge.starts + 24 * 60 * 60 * (day - 1)) * 1000
                ).getDate()
              ).slice(-2) +
              "." +
              (
                "0" +
                (new Date(
                  (selectedChallenge.starts + 24 * 60 * 60 * (day - 1)) * 1000
                ).getMonth() +
                  1)
              ).slice(-2) +
              "." +
              new Date(
                (selectedChallenge.starts + 24 * 60 * 60 * (day - 1)) * 1000
              ).getFullYear()
            }}</span>
          </div>
        </div>
        <div class="days-list__day__right">
          <button
            v-if="
              isAuthenticated &&
              selectedChallenge.starts + 24 * 60 * 60 * (day - 1) < epochTime &&
              selectedChallenge.participants.includes(parseInt(userObj.id)) &&
              selectedChallenge.participantsData[userObj.id.toString()][
                day - 1
              ] != true
            "
            @click="checkDay(day)"
          >
            Check Strava
          </button>
          <span
            v-if="
              isAuthenticated &&
              selectedChallenge.starts + 24 * 60 * 60 * (day - 1) < epochTime &&
              !selectedChallenge.participants.includes(parseInt(userObj.id))
            "
            @click="checkDay(day)"
          >
            Not participant
          </span>
          <RouterLink
            to="/account"
            v-if="
              !isAuthenticated &&
              selectedChallenge.starts + 24 * 60 * 60 * (day - 1) < epochTime
            "
            @click="checkDay(day)"
          >
            Login to do
          </RouterLink>
          <span
            v-if="
              isAuthenticated &&
              selectedChallenge.starts + 24 * 60 * 60 * (day - 1) < epochTime &&
              selectedChallenge.participants.includes(parseInt(userObj.id)) &&
              selectedChallenge.participantsData[userObj.id.toString()][
                day - 1
              ] == true
            "
            @click="checkDay(day)"
          >
            Done
          </span>
          <span
            v-if="
              selectedChallenge.starts + 24 * 60 * 60 * (day - 1) > epochTime
            "
          >
            {{
              `Opens ` +
              (
                "0" +
                new Date(
                  (selectedChallenge.starts + 24 * 60 * 60 * (day - 1)) * 1000
                ).getDate()
              ).slice(-2) +
              "." +
              (
                "0" +
                (new Date(
                  (selectedChallenge.starts + 24 * 60 * 60 * (day - 1)) * 1000
                ).getMonth() +
                  1)
              ).slice(-2) +
              "." +
              new Date(
                (selectedChallenge.starts + 24 * 60 * 60 * (day - 1)) * 1000
              ).getFullYear()
            }}
          </span>
        </div>
      </li>
    </ul>
    <ul id="challenge-participants-list">
      <li
        v-for="person in selectedChallenge.participantsProfiles"
        class="challenge-participants-list__elem"
      >
        <img
          class="challenge-participants-list__elem__avatar"
          :src="person.avatar"
          alt=""
        />
        <span class="challenge-participants-list__elem__name">{{
          person.name
        }}</span>
        <span class="challenge-participants-list__record">{{
          person.data
        }}</span>
        <button
          class="challenge-participants-list__remove"
          v-if="userObj.admin"
          @click="kickParticipant(person.id)"
        >
          Remove
        </button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.personOnMap {
  background-color: aqua;
  color: black;
  padding: 4px;
  border-radius: 4px;
}
.go-back {
  width: 100%;
  max-width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: none;
  border: none;
  padding: 0 12px;
  color: var(--text-color);
}
.go-back svg {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  margin-right: 22px;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding: 24px 12px;
  overflow: hidden;
}
main.one-time {
  width: 100%;
  min-height: 50vh;
  height: 100vh;
  background-color: var(--header-bg-color);
  top: -36px;
  border-radius: 24px 24px 0 0;
  color: var(--text-color);
}
#challenge-top-info {
  width: 100%;
  max-width: 512px;
  min-height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
#days-list,
#markers-list {
  width: 100%;
  max-width: 512px;
  list-style: none;
  padding: 0;
}
.days-list__day,
.markers-list__elem {
  width: 100%;
  max-width: 512px;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.days-list__day__left {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}
.days-list__day__left__icon {
  width: 24px;
  height: 24px;
  margin-right: 6px;
}
.days-list__day__left__icon svg {
  width: 100%;
  height: 100%;
}
.days-list__day__left__info {
  display: flex;
  flex-direction: column;
}
.days-list__day__left__info__top {
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 16px;
  color: var(--text-color);
}
#challenge-participants-list {
  width: 100%;
  max-width: 512px;
  padding: 0;
  list-style: none;
}
.challenge-participants-list__elem {
  height: 48px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}
.challenge-participants-list__elem__avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  flex-shrink: 0;
}
.challenge-participants-list__remove {
  width: 128px;
  height: 36px;
}
.markers-list__elem__left {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.markers-list__elem__left__left {
  width: 64px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 6px;
}
.markers-list__elem__left__left svg {
  width: 24px;
  height: 42px;
  flex-shrink: 0;
}
.markers-list__elem__right {
  width: 50px;
  flex-shrink: 0;
}
.markers-list__elem__right span {
  width: 100%;
  display: block;
  text-align: right;
}
</style>
