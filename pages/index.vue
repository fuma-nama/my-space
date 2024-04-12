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
      :class="{
        'p-4 rounded-xl border bg-neutral-900/50 border-neutral-400/50 shadow-xl shadow-black/50 backdrop-blur-xl w-full max-w-[400px] transition-all': true,
        'scale-50 opacity-0': !store.loaded,
      }"
    >
      <div class="flex flex-row justify-between">
        <h2 class="font-semibold">Notes</h2>
        <NewNote />
      </div>

      <ul class="flex flex-col border-t border-neutral-400/50 mt-2 py-2">
        <li
          v-for="(item, i) in store.notes"
          :class="{
            'py-2 rounded-lg -mx-2 p-2 cursor-pointer select-none': true,
            'bg-neutral-200/20': i === selected,
          }"
          @click="selected = selected === i ? undefined : i"
        >
          <h3 class="flex flex-row justify-between">
            <span class="text-sm font-medium">{{ item.title }}</span>
            <span class="text-xs text-neutral-300">{{
              new Date(item.date).toLocaleDateString()
            }}</span>
          </h3>
          <span class="text-xs text-neutral-300">{{ item.description }}</span>
        </li>
      </ul>
      <p v-if="store.notes.length === 0" class="text-xs text-neutral-300">
        You don't have any notes yet.
      </p>
      <button
        v-if="selected !== undefined && selected < store.notes.length"
        :class="cn(buttonVariants({ className: 'mt-2', variant: 'secondary' }))"
        @click="if (selected !== undefined) removeItem(selected);"
      >
        Remove
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { buttonVariants } from "~/components/theme";

const config = useRuntimeConfig();

const selected = ref<number>();
const date = ref<string>();
const hours = ref<string>();
const minutes = ref<string>();
const location = ref<{ country: string; city: string; state: string }>();

useHead({
  title: "Your Space",
});

let timer = 0;

onMounted(() => {
  setTime();
  setLocation();
  store.init();

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

function removeItem(index: number) {
  const newItems = store.notes.filter((_, j) => index !== j);

  store.setNotes(newItems);
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
