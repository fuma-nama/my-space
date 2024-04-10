<template>
  <div class="relative flex flex-col items-center px-4 py-12 min-h-dvh sm:p-28">
    <div class="text-center mb-16">
      <p class="font-medium">
        {{
          [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ][now.getDay() - 1]
        }}
      </p>
      <h1 class="font-bold text-8xl mb-2">
        {{ now.getHours().toString().padStart(2, "0") }}:{{
          now.getMinutes().toString().padStart(2, "0")
        }}
      </h1>
      <p class="text-sm">{{ location.city }} {{ location.state }}</p>
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

const location = ref<{ country: string; city: string; state: string }>({
  country: "---",
  city: "---",
  state: "---",
});
const now = ref(new Date(Date.now()));

useHead({
  title: "Hello World",
});

interface LocationResponse {
  city: {
    name: string;
    names: Record<string, string>;
  };
  continent: {
    code: string;
    geoname_id: number;
    name: string;
    names: Record<string, string>;
  };
  state: {
    name: string;
  };
  country: {
    name: string;
  };
}

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
  setLocation();

  timer = window.setInterval(() => {
    now.value = new Date(Date.now());
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

async function setLocation() {
  const res = await fetch(
    `https://api.geoapify.com/v1/ipinfo?&apiKey=${config.public.geoapifyApiKey}`,
    { method: "GET" }
  );

  if (!res.ok) return;
  const result = (await res.json()) as LocationResponse;
  location.value = {
    country: result.country.name,
    city: result.city.name,
    state: result.state.name,
  };
}
</script>
