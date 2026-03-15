<script setup lang="ts"></script>

<template>
  <div>
    <div class="app-container">
      <div class="controls">
        <select v-model="lang">
          <option value="jp">日本語 (JP)</option>
          <option value="en">English (EN)</option>
        </select>

        <select v-model="selectedLine">
          <option value="TokyoMetro.Ginza">Tokyo Metro - Ginza Line</option>
          <option value="JR-East.Yamanote">JR East - Yamanote Line</option>
        </select>

        <select v-model="selectedStation" v-if="selectedLine === 'TokyoMetro.Ginza'">
          <option value="TokyoMetro.Ginza.Shibuya">Shibuya</option>
          <option value="TokyoMetro.Ginza.Ginza">Ginza</option>
          <option value="TokyoMetro.Ginza.Asakusa">Asakusa</option>
        </select>

        <select v-model="selectedStation" v-if="selectedLine === 'JR-East.Yamanote'">
          <option value="JR-East.Yamanote.Shinjuku">Shinjuku</option>
          <option value="JR-East.Yamanote.Tokyo">Tokyo</option>
          <option value="JR-East.Yamanote.Akihabara">Akihabara</option>
        </select>
      </div>

      <div class="sign-casing">
        <div class="led-screen">
          <div class="top-row">
            <span class="time">{{ trainData.time }}</span>
            <span class="train-type">{{ currentType }}</span>
            <span class="destination">{{ currentDestination }}</span>
          </div>

          <div class="bottom-row" :class="{ warning: lang === 'jp' }">
            <div class="marquee-container">
              <span class="marquee-text">{{ currentInfo }}</span>
            </div>
          </div>
        </div>

        <div class="track-section">
          <div class="track-circle">{{ trainData.track }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="app-container">
    <div class="disclaimer-footer">
      <p>
        <strong>Data Source:</strong> Public Transportation Open Data Center
        (公共交通オープンデータセンター).<br />
        This application uses open data provided by public transportation operators.
      </p>
      <p class="warning-text">
        <strong>⚠️ Important:</strong> The transit operators (e.g., JR, Tokyo Metro) are not
        responsible for this application. Please
        <strong>do not contact station staff or the railway companies</strong> regarding the
        information displayed here.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// State updated for ODPT format
const lang = ref('jp')
const selectedLine = ref('TokyoMetro.Ginza')
const selectedStation = ref('TokyoMetro.Ginza.Shibuya')
const isLoading = ref(false)

const trainData = ref({
  time: '--:--',
  track: '-',
  type: { jp: '', en: '' },
  destination: { jp: '', en: '' },
  info: { jp: 'Loading...', en: 'Loading...' },
})

// Fetch data from our Vercel Serverless Function
const fetchTrainData = async () => {
  isLoading.value = true
  try {
    // FIXED: Now correctly sending the ODPT stationId to the backend
    const response = await fetch(`/api/trains?stationId=${selectedStation.value}`)
    const data = await response.json()

    trainData.value = data
  } catch (error) {
    console.error('Error fetching train data:', error)
    trainData.value.info = { jp: 'エラーが発生しました', en: 'Error loading data' }
  } finally {
    isLoading.value = false
  }
}

// If the user changes the train line, reset the station to a valid default for that line
watch(selectedLine, (newLine) => {
  if (newLine === 'TokyoMetro.Ginza') {
    selectedStation.value = 'TokyoMetro.Ginza.Shibuya'
  } else if (newLine === 'JR-East.Yamanote') {
    selectedStation.value = 'JR-East.Yamanote.Shinjuku'
  }
})

// Automatically fetch new data when the specific station changes
watch(selectedStation, () => {
  fetchTrainData()
})

// Fetch initial data when the component loads
onMounted(() => {
  fetchTrainData()
})

// Computed properties for language toggling
const currentType = computed(() => trainData.value.type[lang.value])
const currentDestination = computed(() => trainData.value.destination[lang.value])
const currentInfo = computed(() => trainData.value.info[lang.value])
</script>

<style scoped>
/* Import the LED-style font */
@import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');

.app-container {
  font-family: sans-serif;
  background: #f0f0f0;
  padding: 20px;
  min-height: 100vh;
  text-align: center;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

select {
  padding: 5px;
  font-size: 16px;
}

/* Physical Sign Casing */
.sign-casing {
  background: #e0e0e0;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: inline-flex;
  width: auto;
  height: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* LED Screen Container */
.led-screen {
  background: #111;
  color: #fff;
  font-family: 'DotGothic16', monospace;
  padding: 15px 20px;
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; /* Keeps the marquee inside the screen */
}

/* Top Row: Time, Type, Destination */
.top-row {
  display: flex;
  align-items: center;
  font-size: 28px;
  gap: 20px;
}

.time {
  color: #5f5; /* Neon Green */
}

.train-type {
  border: 2px solid #fff;
  padding: 0 8px;
  color: #fff;
  font-size: 24px;
}

.destination {
  color: #f55; /* Neon Red/Orange */
}

/* Bottom Row: Information with Marquee */
.bottom-row {
  color: #5f5;
  font-size: 20px;
  margin-top: 15px;
}

.bottom-row.warning {
  color: #f55;
}

/* Marquee Animation CSS */
.marquee-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-text {
  display: inline-block;
  padding-left: 100%; /* Start off-screen to the right */
  animation: scroll-left 12s linear infinite;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Track Number Section */
.track-section {
  background: #e0e0e0;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 2px solid #ccc;
}

.track-circle {
  background: #e44;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: bold;
  font-family: Arial, sans-serif;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Disclaimer Footer Styles */
.disclaimer-footer {
  margin-top: 30px;
  max-width: 500px;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  text-align: left;
  background: #fff;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.warning-text {
  color: #d32f2f;
  margin-top: 10px;
}
</style>
