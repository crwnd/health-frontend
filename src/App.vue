<script setup>
import { RouterLink, RouterView } from "vue-router";
import HeaderGeneral from "./views/HeaderGeneral.vue";
import ModalMenuWindow from "@/components/modal-menu-window.vue";
import ModalChallengeCreateWindow from "@/components/modal-challenge-create-window.vue";
import TopBanner from "@/components/top-page-banner.vue";
</script>

<script>
export default {
  name: "App",
  components: {
    HeaderGeneral,
    ModalMenuWindow,
    TopBanner,
    ModalChallengeCreateWindow,
  },
  data() {
    return {
      epochTime: Math.round(Date.now() / 1000),
      editingChallenge: -1,
      isAuthenticated:
        localStorage.getItem("isAuthenticated") === "true" ? true : false,
      userObj: {
        sessions: [
          {
            isLoading: true,
            isActive: false,
            started: 0,
            infoString: "Loading...",
          },
          {
            isLoading: true,
            isActive: false,
            started: 0,
            infoString: "Loading...",
          },
          {
            isLoading: true,
            isActive: false,
            started: 0,
            infoString: "Loading...",
          },
        ],
        name: "...",
        has_strava_token: false,
        participated: [],
        admin: false,
        id: -1,
        avatar:""
      },
      openedModal: undefined,
      challenges: [
        {
          id: 0,
          image: "/static/previews/tomi-vadasz-SBKJ47obEHY-unsplash.jpg",
          image_square: "",
          cname: "loading1...",
          cdesc: "loading1...",
          coordinates: [],
          participantsData: [],
          participantsProfiles: [],
        },
        {
          id: 1,
          image: "/static/previews/tomi-vadasz-SBKJ47obEHY-unsplash.jpg",
          image_square: "",
          cname: "loading2...",
          cdesc: "loading2...",
          coordinates: [],
          participantsData: [],
          participantsProfiles: [],
        },
      ],
    };
  },
  computed: {
    likedProducts() {
      return this.likedList;
    },
  },
  created() {
    if (localStorage.getItem("theme")) {
      document.body.classList.add(localStorage.getItem("theme"));
    }
    this.likedList = JSON.parse(localStorage.getItem("likedList"));
    this.cartedList = JSON.parse(localStorage.getItem("cartedList"));
    this.syncWithServer();
    setInterval(this.modifyEpoch, 1000);
  },
  methods: {
    modifyEpoch() {
      this.epochTime = Math.round(Date.now() / 1000);
    },
    async SignIn(submitEvent) {
      let email = submitEvent.target.elements.email.value;
      let pass = submitEvent.target.elements.pass.value;
      let json = await (
        await fetch("https://api.crwnd.dev/api/auth/signin/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            pass: pass,
            email: email,
          }),
        })
      ).json();
      console.log(json);
      if (json.code == 0) {
        this.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", true);
        this.syncWithServer();
      } else {
        alert(json.message + "\nFailing fields: " + json.errors);
      }
    },
    async SignUp(submitEvent) {
      let email = submitEvent.target.elements.email.value;
      let pass = submitEvent.target.elements.pass.value;
      let name = submitEvent.target.elements.name.value;
      let json = await (
        await fetch("https://api.crwnd.dev/api/auth/signup/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            pass: pass,
            email: email,
            name: name,
          }),
        })
      ).json();
      console.log(json);
      if (json.code == 0) {
        this.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", true);
        this.syncWithServer();
      } else {
        alert(json.message);
      }
    },
    async LogOut() {
      await fetch("https://api.crwnd.dev/api/auth/logout/", {
        method: "POST",
        credentials: "include",
      });
      this.isAuthenticated = false;
      localStorage.setItem("isAuthenticated", false);
    },
    async syncWithServer() {
      let resp = await (
        await fetch("https://api.crwnd.dev/api/main-info/", {
          method: "POST",
          credentials: "include",
        })
      ).json();
      console.log(resp);
      if (resp.code == 0) {
        this.challenges = resp.challenges;
      }

      if (!this.isAuthenticated) {
        return;
      }
      let json = await (
        await fetch("https://api.crwnd.dev/users/getme/", {
          method: "POST",
          credentials: "include",
        })
      ).json();
      console.log(json);
      if (json.code == 0) {
        this.userObj.sessions = json.sessions;
        this.userObj.id = json.id;
        this.userObj.email = json.email;
        this.userObj.currentSessionID = json.currentSessionID;
        this.userObj.name = json.name;
        this.userObj.has_strava_token = json.has_strava_token;
        this.userObj.participated = json.participated;
        this.userObj.admin = json.admin;
        this.userObj.avatar = json.avatar;
      } else {
        this.isAuthenticated = false;
      }
    },
    async fetchListContent(source) {
      let json = await (
        await fetch("https://api.crwnd.dev/lists/" + source + "", {
          method: "POST",
          credentials: "include",
        })
      ).json();
      console.log(json);
      switch (json.code) {
        case 0:
          return json.content;
        case 1:
          throw "err: " + json.message;
          break;
        default:
          throw "unknown err: " + json.message;
      }
    },
    async unlinkStrava() {
      this.userObj.has_strava_token = false;
      await fetch("https://api.crwnd.dev/api/strava-unlink/", {
        method: "POST",
        credentials: "include",
      });
    },
    getMiddlePoint(coordinates) {
      if (coordinates.length == 0) {
        return [23.106111, 53.5775];
      }
      if (coordinates.length == 1) {
        return coordinates[0];
      }
      let sumX = 0;
      let sumY = 0;

      // Calculate the sum of all X and Y coordinates
      coordinates.forEach((coord) => {
        sumX += coord[0];
        sumY += coord[1];
      });

      // Calculate the average X and Y coordinates
      const avgX = sumX / coordinates.length;
      const avgY = sumY / coordinates.length;

      // Return the middle point as an array
      return [avgX, avgY];
    },
    coordinatesToMeters(lat1, lon1, lat2, lon2) {
      // generally used geo measurement function
      var R = 6378.137; // Radius of earth in KM
      var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
      var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d * 1000; // meters
    },
    routeToMeters(arrOfCords) {
      let distance = 0;
      for (let i = 0; i < arrOfCords.length - 1; i++) {
        distance += this.coordinatesToMeters(
          arrOfCords[i][1],
          arrOfCords[i][0],
          arrOfCords[i + 1][1],
          arrOfCords[i + 1][0]
        );
      }
      return Math.floor(distance);
    },
    async enrollChallenge(challengeID) {
      let json = await (
        await fetch("https://api.crwnd.dev/api/enroll-challenge/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            challengeid: challengeID,
          }),
        })
      ).json();
      console.log(json);
      if (json.code == 0) {
        this.userObj.participated.push(
          this.challenges.find((el) => el.id == challengeID)
        );
      } else {
        alert(json.message);
      }
    },
    async leaveChallenge(challengeID) {
      let json = await (
        await fetch("https://api.crwnd.dev/api/leave-challenge/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            challengeid: challengeID,
          }),
        })
      ).json();
      console.log(json);
      if (json.code == 0) {
        this.userObj.participated = this.userObj.participated.filter(
          (el) => el.id != challengeID
        );
      } else {
        alert(json.message);
      }
    },
    updateChallengeWithObject(challengeObj) {
      console.log("challengeObj", challengeObj);
      Object.assign(
        this.challenges.find((prod) => prod.id == challengeObj.id),
        challengeObj
      );
      return this.challengeObj;
    },
    challengeFinishTime(challnge) {
      switch (challnge.ctype) {
        case "daily":
          return challnge.starts + 24 * 60 * 60 * challnge.longs;
        case "one-time":
          return challnge.starts + 2 * 60 * challnge.longs;
      }
    },
    openedModalListener(newvalue) {
      this.openedModal = newvalue;
    },
    editingChallengeListener(newvalue) {
      this.editingChallenge = newvalue;
    },
  },
};
</script>

<template>
  <TopBanner :user-obj="userObj" :is-authenticated="isAuthenticated" />
  <HeaderGeneral
    v-model="openedModal"
    :user-obj="userObj"
    :is-authenticated="isAuthenticated"
    @update:editing-challenge="editingChallengeListener"
  />
  <div id="page-content">
    <RouterView
      :challenges="challenges"
      :likedProducts="likedProducts"
      :signin-function="SignIn"
      :signup-function="SignUp"
      :logout-function="LogOut"
      :is-authenticated="isAuthenticated"
      :user-obj="userObj"
      :unlink-strava="unlinkStrava"
      :get-middle-point="getMiddlePoint"
      :enroll-challenge="enrollChallenge"
      :leave-challenge="leaveChallenge"
      :coordinates-to-meters="coordinatesToMeters"
      :epoch-time="epochTime"
      :challengeFinishTime="challengeFinishTime"
      :routeToMeters="routeToMeters"
      :editing-challenge="editingChallenge"
      @update:challenge-obj="updateChallengeWithObject"
      @update:opened-modal="openedModalListener"
      @update:editing-challenge="editingChallengeListener"
    />
  </div>
  <ModalMenuWindow
    v-model="openedModal"
    :isAuthenticated="isAuthenticated"
    :logoutFunction="LogOut"
  />
  <ModalChallengeCreateWindow
    :challenges="challenges"
    v-model="openedModal"
    :get-middle-point="getMiddlePoint"
    :coordinates-to-meters="coordinatesToMeters"
    :routeToMeters="routeToMeters"
    :editing-challenge="editingChallenge"
    @update:editing-challenge="editingChallengeListener"
  />
</template>

<style>
#page-content {
  width: 100%;
  max-width: 1600px;
  height: 100%;
}
</style>
