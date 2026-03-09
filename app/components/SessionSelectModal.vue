<script setup lang="ts">
import type { Session } from "~~/types";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    selectedSessionId: string;
    sessions: Session[];
    title?: string;
    label?: string;
    confirmText?: string;
    cancelText?: string;
    emptyText?: string;
    onlyOpen?: boolean;
    excludeSessionId?: string;
  }>(),
  {
    title: "Select Session",
    label: "Session",
    confirmText: "Confirm",
    cancelText: "Cancel",
    emptyText: "No sessions available.",
    onlyOpen: false,
    excludeSessionId: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:selectedSessionId", value: string): void;
  (e: "confirm", payload: { sessionId: string; session?: Session }): void;
  (e: "cancel"): void;
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const localSelectedSessionId = computed({
  get: () => props.selectedSessionId,
  set: (value: string) => emit("update:selectedSessionId", value),
});

const sessionOptions = computed(() =>
  props.sessions
    .filter((session) => {
      if (props.onlyOpen && session.status !== "Open") {
        return false;
      }
      if (props.excludeSessionId && session._id === props.excludeSessionId) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.status === b.status) {
        return a.proctor.localeCompare(b.proctor);
      }
      return a.status === "Closed" ? 1 : -1;
    })
    .map((session) => ({
      id: session._id,
      session,
      label: `${session.proctor} - Room ${session.room} (${session.grade})${session.status === "Closed" ? " [Closed]" : ""}`,
    })),
);

const sessionItemProps = (item: any) => ({
  class: item?.session?.status === "Closed" ? "text-error" : "",
});

const selectedSession = computed(() =>
  props.sessions.find(
    (session) => session._id === localSelectedSessionId.value,
  ),
);

const close = () => {
  emit("cancel");
  dialog.value = false;
};

const confirmSelection = () => {
  if (!localSelectedSessionId.value) {
    return;
  }

  emit("confirm", {
    sessionId: localSelectedSessionId.value,
    session: selectedSession.value,
  });
  dialog.value = false;
};
</script>

<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="localSelectedSessionId"
          :items="sessionOptions"
          :item-props="sessionItemProps"
          item-title="label"
          item-value="id"
          :label="label"
          variant="outlined"
          clearable
          :disabled="sessionOptions.length === 0"
        ></v-autocomplete>
        <div v-if="sessionOptions.length === 0" class="text-medium-emphasis">
          {{ emptyText }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">{{ cancelText }}</v-btn>
        <v-btn
          color="primary"
          :disabled="!localSelectedSessionId || sessionOptions.length === 0"
          @click="confirmSelection"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
