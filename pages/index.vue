<template>
  <div class="relative flex flex-col items-center px-4 py-12 min-h-dvh sm:p-28">
    <div class="text-center mb-16">
      <p
        class="text-lg font-medium transition-opacity duration-500 mb-2"
        :class="{ 'opacity-0': !date }"
      >
        {{ date ?? "Week" }}
      </p>
      <h1
        class="font-bold text-8xl mb-2 transition-opacity duration-500"
        :class="{ 'opacity-0': !hours && !minutes }"
      >
        {{ hours }}:{{ minutes }}
      </h1>
      <Transition mode="out-in">
        <p class="text-sm text-neutral-50/80" v-bind:key="location ? 1 : 0">
          {{ location ? `${location.city} ${location.state}` : "Hello There!" }}
        </p>
      </Transition>
    </div>
    <ClientOnly>
      <Scene />
    </ClientOnly>
    <div
      class="text-sm p-4 rounded-xl border bg-neutral-900/50 border-neutral-400/50 shadow-xl shadow-black/50 backdrop-blur-xl w-full max-w-[400px]"
    >
      <h2 class="mb-4 font-semibold">Notes</h2>

      <ul v-for="item in items" class="flex flex-col">
        <li class="py-2 border-t border-neutral-400/50">
          <h3 class="text-xs font-medium">{{ item.name }}</h3>
          <span class="text-xs text-neutral-400">{{ item.description }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();

const date = ref<string>();
const hours = ref<string>();
const minutes = ref<string>();
const location = ref<{ country: string; city: string; state: string }>();

useHead({
  title: "Your Space",
});

interface NodeItem {
  name: string;
  description: string;
}

const items: NodeItem[] = [
  {
    name: "Learn Vue.js",
    description: "Read Vue.js Documentation in 2024",
  },
  {
    name: "Get some new ideas",
    description: "Coffee time",
  },
];

let timer = 0;

onMounted(() => {
  setTime();
  setLocation();

  timer = window.setInterval(() => setTime(), 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

function setTime() {
  const now = new Date(Date.now());
  hours.value = now.getHours().toString().padStart(2, "0");
  minutes.value = now.getMinutes().toString().padStart(2, "0");
  const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ][now.getDay() - 1];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][now.getMonth()];

  date.value = `${week}, ${now.getDate()} ${month}`;
}

async function setLocation() {
  const result = await fetchGeolocation(config.public.geoapifyApiKey);

  location.value = {
    country: result.country.name,
    city: result.city.name,
    state: result.state.name,
  };
}
</script>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
