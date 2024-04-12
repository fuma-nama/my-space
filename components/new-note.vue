<template>
  <button type="button" @click="openModal" :class="cn(buttonVariants())">
    New
  </button>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      as="div"
      @close="closeModal"
      class="relative z-10"
      @vue:unmounted="reset"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-200 ease-out"
            enter-from="opacity-0 -translate-y-12"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0 -translate-y-12"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-lg border border-neutral-400/50 bg-neutral-800 p-4 shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="font-medium leading-6">
                New Note
              </DialogTitle>
              <input
                id="title"
                v-model="title"
                :class="cn(inputVariants())"
                placeholder="Title"
              />
              <textarea
                id="description"
                v-model="text"
                :class="cn(inputVariants())"
                placeholder="Description"
              />
              <p class="mt-2 text-xs text-neutral-400">
                Create a new note, as a reminder or quick note, it will be shown
                to your primary space.
              </p>

              <div class="mt-4">
                <button
                  type="button"
                  :class="cn(buttonVariants())"
                  @click="done"
                >
                  Done
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import { cva } from "class-variance-authority";
import { buttonVariants } from "./theme";

const inputVariants = cva(
  "mt-2 text-xs p-2 rounded-lg border border-neutral-800 bg-neutral-700 w-full placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
);
const isOpen = ref(false);
const title = ref("");
const text = ref("");

function closeModal() {
  isOpen.value = false;
}

function openModal() {
  isOpen.value = true;
}

function done() {
  if (title.value.trim().length === 0) return;

  const notes = [
    ...store.notes,
    { title: title.value, description: text.value, date: Date.now() },
  ];
  store.setNotes(notes);

  closeModal();
}

function reset() {
  title.value = "";
  text.value = "";
}
</script>
