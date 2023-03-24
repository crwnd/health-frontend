<script setup>
import {
  MapboxMap,
  MapboxMarker,
  MapboxNavigationControl,
  MapboxGeolocateControl,
} from "@studiometa/vue-mapbox-gl";
defineProps([
  "modelValue",
  "getMiddlePoint",
  "coordinatesToMeters",
  "routeToMeters",
  "editing-challenge",
  "challenges",
]);
defineEmits(["update:modelValue", "update:editing-challenge"]);
</script>
<script>
export default {
  data() {
    return {
      markers: [],
      challengeType: "one-time",
    };
  },
  methods: {
    markerDragend(index, event) {
      this.markers[index] = [
        event.target._lngLat.lng,
        event.target._lngLat.lat,
      ];
      console.log("event", event);
    },
    removeItemByIndex(array, index) {
      if (index > -1 && index < array.length) {
        array.splice(index, 1);
      }
      return array;
    },
    localDateTimeToTimestamp(localDate, localTime) {
      const dateTimeString = localDate + "T" + localTime;
      const localTimestamp = Date.parse(dateTimeString);
      const unixTimestamp = Math.floor(localTimestamp / 1000);

      return unixTimestamp;
    },
    async sumbitChallenge(submitEvent) {
      console.log("submitEvent", submitEvent);
      let ctype = submitEvent.target.elements.ctype.value;
      let name = submitEvent.target.elements.name.value;
      let description = submitEvent.target.elements.description.value;
      let sporttype = submitEvent.target.elements.sporttype.value;
      let time = submitEvent.target.elements.appt.value;
      let longs = submitEvent.target.elements.longs.value;
      let tripStart = submitEvent.target.elements["trip-start"].value;
      let markers = submitEvent.target.elements.markers.value;
      let distance = submitEvent.target.elements.distance.value;
      let epoch = this.localDateTimeToTimestamp(
        tripStart,
        ctype != "daily" ? time : "00:00" + ":00"
      );
      let json = await (
        await fetch(
          this.editingChallenge > -1
            ? "https://api.crwnd.dev/api/update-challenge/"
            : "https://api.crwnd.dev/api/create-challenge/",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              name: name,
              description: description,
              ctype: ctype,
              time: epoch,
              longs: parseInt(longs),
              markers: markers,
              sporttype: sporttype,
              distance: distance,
            }),
          }
        )
      ).json();
      console.log(json);
      if (json.code != 0) {
        alert(json.message + "\nFailing fields: " + json.errors);
      }
    },
  },
};
</script>
<template>
  <div
    id="modal-catalog-window"
    class="modal-window modalable"
    :class="{ hidden: modelValue !== 'createChallenge' }"
    @click="
      {
        $emit('update:editing-challenge', -1);
        $emit('update:modelValue', undefined);
      }
    "
  >
    <div id="modal-catalog" class="modal-content" @click.stop="">
      <div id="modal-catalog__header" class="modal-content__header">
        <h2 id="modal-catalog__header__title">
          {{ editingChallenge > -1 ? "Editing challenge" : "New challenge" }}
        </h2>
        <button
          id="modal-catalog__header__close"
          class="close-modal modal-content__header__close"
          @click="
            {
              $emit('update:editing-challenge', -1);
              $emit('update:modelValue', undefined);
            }
          "
        >
          <svg>
            <use xlink:href="/src/assets/icons.svg?005#close-outline"></use>
          </svg>
        </button>
      </div>
      <div
        class="map"
        style="width: 100%; height: 400px; flex-shrink: 0"
        v-show="challengeType == 'one-time'"
      >
        <MapboxMap
          style="height: 100%; width: 100%"
          access-token="pk.eyJ1IjoiY3J3bmQiLCJhIjoiY2xmaTQ1Y2NwMDVqbjNvcG41Z2x0d3Y2dCJ9.i0arSZ2VpeDgE6PZXVNUxg"
          map-style="mapbox://styles/mapbox/streets-v11"
          :center="getMiddlePoint(markers)"
          :zoom="5"
        >
          <MapboxMarker
            v-for="(marker, index) in markers"
            :lng-lat="marker"
            :key="index"
            :draggable="true"
            @mb-dragend="markerDragend(index, $event)"
          >
            <p class="custom-marker">{{ index + 1 }}</p></MapboxMarker
          >
          <MapboxNavigationControl position="bottom-right" showZoom="true" />
          <MapboxGeolocateControl />
        </MapboxMap>
      </div>
      <div id="markers-in-form" v-if="challengeType == 'one-time'">
        <ul>
          <li
            v-for="(marker, index) in markers"
            @click="markers = removeItemByIndex(markers, index)"
          >
            {{ index == 0 ? "Start" : "Marker " + (index + 1) }}
            <!--{{ marker[0] }}, {{ marker[1] }}-->
            {{
              index != 0
                ? " - " +
                  Math.floor(
                    coordinatesToMeters(
                      markers[index - 1][1],
                      markers[index - 1][0],
                      marker[1],
                      marker[0]
                    )
                  ) +
                  "m"
                : ""
            }}
            <svg>
              <use xlink:href="/src/assets/icons.svg?005#close-outline"></use>
            </svg>
          </li>
        </ul>
        <button
          id="markers-in-form__add-marker"
          @click="markers.push(getMiddlePoint(markers))"
        >
          <svg>
            <use xlink:href="/src/assets/icons.svg?005#location-outline"></use>
          </svg>
          <span>Add</span>
        </button>
      </div>
      <span v-if="challengeType == 'one-time'"
        >Total way: {{ routeToMeters(markers) }} m</span
      >
      <form @submit.prevent="sumbitChallenge" id="create-challenge-form">
        <input
          type="text"
          placeholder="Name"
          name="name"
          id="create-challenge-name"
          required
        />
        <input
          type="text"
          placeholder="description"
          name="description"
          required
        />
        <select name="type" id="ctype" v-model="challengeType" required>
          <option disabled>Type</option>
          <option value="daily">Mileage in X days</option>
          <option value="one-time">One-time challenge</option>
        </select>
        <select name="type" id="sporttype" required>
          <option disabled>Sport</option>
          <option value="walk">Walk</option>
          <option value="run">Run</option>
          <option value="cycling">Cycling</option>
        </select>
        <span v-show="challengeType == 'one-time'">Start time:</span>
        <input
          v-show="challengeType == 'one-time'"
          type="time"
          id="appt"
          name="appt"
          value="08:00"
        />
        <span v-show="challengeType == 'daily'">Distance in meters:</span>
        <input
          v-show="challengeType == 'daily'"
          type="number"
          id="distance"
          name="distance"
          value="1000"
        />
        <span
          >Longs in
          {{ challengeType == "one-time" ? "minutes" : "days" }}:</span
        >
        <input type="number" id="longs" name="longs" required />
        <span>Start date:</span>
        <input
          type="date"
          id="start"
          name="trip-start"
          min="2023-03-01"
          max="2023-12-31"
          required
        />
        <input type="hidden" name="markers" :value="JSON.stringify(markers)" />
        <input type="submit" value="Publish" id="btn-send-form" />
      </form>
    </div>
  </div>
</template>

<style>
.custom-marker {
  padding: 0.75em;
  background-color: #fff;
  border-radius: 5px;
  color: black;
}
#create-challenge-form {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
#create-challenge-form input,
#create-challenge-form select {
  /* height: 40px; */
  width: 90%;
  background: #7b93ff;
  border-radius: 13px;
  border: none;
  padding: 12px 24px;
  color: #fff;
}
#markers-in-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
}
#markers-in-form ul {
  width: 60%;
  display: flex;
  flex-direction: column;
  padding: 0;
  list-style: none;
  gap: 8px;
}
#markers-in-form ul li {
  height: 32px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #7b93ff;
  border-radius: 13px;
  color: #fff;
  padding: 0 12px;
}
#markers-in-form ul li svg {
  width: 24px;
  height: 24px;
}
#markers-in-form__add-marker {
  height: 85px;
  width: 85px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #5a78ff;
  border-radius: 13px;
}
#markers-in-form__add-marker svg {
  width: 24px;
  height: 24px;
}
#create-challenge-name {
  width: 80%;
}
#btn-send-form {
  height: 48px;
  background-color: #4961cd;
}
</style>
