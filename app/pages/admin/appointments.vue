<script setup lang="ts">
interface LatestAppointment {
  _id: string;
  submissionId: string;
  FirstName?: string;
  LastName?: string;
  GradeEntering?: string;
  appointmentDate: string;
  appointmentTime: string;
  submittedDate?: string;
}

interface SummaryRow {
  summaryKey: string;
  GradeEntering: string;
  appointmentTime: string;
  count: number;
}

const selectedAppointmentDate = ref<string>("All");
const selectedSummaryKey = ref<string | null>(null);
const latestAppointmentsEndpoint: string = "/api/appointments/latest";
const hasInitializedDateFilter = ref(false);

const {
  data: latestAppointmentsData,
  pending,
  error,
  refresh,
} = await useAsyncData<LatestAppointment[]>("latest-appointments", () =>
  $fetch<LatestAppointment[]>(latestAppointmentsEndpoint),
);

const latestAppointments = computed<LatestAppointment[]>(
  () => latestAppointmentsData.value ?? [],
);

const parseAppointmentDateToTimestamp = (dateText: string): number => {
  const parsed = Date.parse(dateText);
  if (!Number.isNaN(parsed)) return parsed;

  const withoutWeekday = dateText.replace(/^[A-Za-z]+,\s*/, "");
  const fallbackParsed = Date.parse(withoutWeekday);
  if (!Number.isNaN(fallbackParsed)) return fallbackParsed;

  return Number.MAX_SAFE_INTEGER;
};

const appointmentDateOptions = computed<string[]>(() => {
  const uniqueDates = Array.from(
    new Set(
      latestAppointments.value
        .map((item) => item.appointmentDate)
        .filter(Boolean),
    ),
  );

  uniqueDates.sort(
    (a, b) =>
      parseAppointmentDateToTimestamp(a) - parseAppointmentDateToTimestamp(b),
  );

  return ["All", ...uniqueDates];
});

const getDefaultAppointmentDateOption = (options: string[]): string => {
  const dateOptions = options.filter((option) => option !== "All");
  if (!dateOptions.length) return "All";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const nextDate = dateOptions.find(
    (option) => parseAppointmentDateToTimestamp(option) >= todayTimestamp,
  );

  return nextDate || dateOptions[0] || "All";
};

watch(
  appointmentDateOptions,
  (options) => {
    if (!hasInitializedDateFilter.value) {
      selectedAppointmentDate.value = getDefaultAppointmentDateOption(options);
      hasInitializedDateFilter.value = true;
      return;
    }

    if (!options.includes(selectedAppointmentDate.value)) {
      selectedAppointmentDate.value = getDefaultAppointmentDateOption(options);
    }
  },
  { immediate: true },
);

const filteredAppointments = computed<LatestAppointment[]>(() => {
  if (selectedAppointmentDate.value === "All") {
    return latestAppointments.value;
  }

  return latestAppointments.value.filter(
    (item) => item.appointmentDate === selectedAppointmentDate.value,
  );
});

const parseAppointmentTimeToMinutes = (time: string): number => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  const [, hoursPart, minutesPart, meridiemPart] = match;
  if (!hoursPart || !minutesPart || !meridiemPart) {
    return Number.MAX_SAFE_INTEGER;
  }

  let hours = Number(hoursPart);
  const minutes = Number(minutesPart);
  const meridiem = meridiemPart.toLowerCase();

  if (meridiem === "p.m." && hours !== 12) hours += 12;
  if (meridiem === "a.m." && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const parseGradeSortValue = (gradeValue: string | undefined): number => {
  if (!gradeValue) return Number.MAX_SAFE_INTEGER;
  const normalized = gradeValue.trim().toUpperCase();
  if (normalized === "IEP") return -1;
  if (normalized === "K-1") return 0;
  if (normalized === "3-4") return 3;
  if (normalized === "5-6") return 5;
  if (normalized === "7-8") return 7;
  if (
    normalized === "K" ||
    normalized === "KG" ||
    normalized === "KINDERGARTEN"
  ) {
    return 0;
  }

  const numeric = Number(normalized);
  if (!Number.isNaN(numeric)) return numeric;

  return Number.MAX_SAFE_INTEGER - 1;
};

const isWeekendAppointmentDate = (appointmentDate: string): boolean => {
  const timestamp = parseAppointmentDateToTimestamp(appointmentDate);
  if (timestamp === Number.MAX_SAFE_INTEGER) {
    return false;
  }

  const dayOfWeek = new Date(timestamp).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const getSummaryGradeBucket = (
  gradeValue: string | undefined,
  appointmentDate: string,
): string => {
  if (!gradeValue) return "Unknown";

  const normalized = gradeValue.trim().toUpperCase();
  if (
    normalized === "K" ||
    normalized === "KG" ||
    normalized === "KINDERGARTEN" ||
    normalized === "1"
  ) {
    return "K-1";
  }

  if (!isWeekendAppointmentDate(appointmentDate)) {
    if (normalized === "3" || normalized === "4") return "3-4";
    if (normalized === "5" || normalized === "6") return "5-6";
    if (normalized === "7" || normalized === "8") return "7-8";
  }

  return gradeValue;
};

const summaryRows = computed<SummaryRow[]>(() => {
  const summaryMap = new Map<string, number>();

  filteredAppointments.value.forEach((appointment) => {
    const grade = getSummaryGradeBucket(
      appointment.GradeEntering,
      appointment.appointmentDate,
    );
    const key = `${grade}||${appointment.appointmentTime}`;
    const current = summaryMap.get(key) ?? 0;
    summaryMap.set(key, current + 1);
  });

  return Array.from(summaryMap.entries())
    .map(([key, count]) => {
      const [GradeEntering, appointmentTime] = key.split("||");
      return {
        summaryKey: key,
        GradeEntering: GradeEntering || "Unknown",
        appointmentTime: appointmentTime || "",
        count,
      };
    })
    .sort(
      (a, b) =>
        parseGradeSortValue(a.GradeEntering) -
          parseGradeSortValue(b.GradeEntering) ||
        a.GradeEntering.localeCompare(b.GradeEntering) ||
        parseAppointmentTimeToMinutes(a.appointmentTime) -
          parseAppointmentTimeToMinutes(b.appointmentTime),
    );
});

const extractSummaryRow = (
  item: SummaryRow | { raw?: SummaryRow } | undefined,
): SummaryRow | undefined => {
  if (!item) return undefined;
  if ("summaryKey" in item) return item;
  return item.raw;
};

const onSummaryRowClick = (
  _event: Event,
  payload: { item?: SummaryRow | { raw?: SummaryRow } },
) => {
  const row = extractSummaryRow(payload?.item);
  if (!row?.summaryKey) return;

  selectedSummaryKey.value =
    selectedSummaryKey.value === row.summaryKey ? null : row.summaryKey;
};

const getSummaryRowProps = (payload: {
  item?: SummaryRow | { raw?: SummaryRow };
}) => {
  const row = extractSummaryRow(payload?.item);
  if (!row?.summaryKey) {
    return { class: "summary-row" };
  }

  return {
    class:
      selectedSummaryKey.value === row.summaryKey
        ? "summary-row summary-row--active"
        : "summary-row",
  };
};

const clearSummarySelection = () => {
  selectedSummaryKey.value = null;
};

watch(summaryRows, (rows) => {
  if (!selectedSummaryKey.value) return;

  const stillExists = rows.some(
    (row) => row.summaryKey === selectedSummaryKey.value,
  );
  if (!stillExists) {
    selectedSummaryKey.value = null;
  }
});

const sortedFilteredAppointments = computed<LatestAppointment[]>(() =>
  [...filteredAppointments.value].sort(
    (a, b) =>
      parseAppointmentTimeToMinutes(a.appointmentTime) -
      parseAppointmentTimeToMinutes(b.appointmentTime),
  ),
);

const detailAppointments = computed<LatestAppointment[]>(() => {
  if (!selectedSummaryKey.value) {
    return sortedFilteredAppointments.value;
  }

  const selectedRow = summaryRows.value.find(
    (row) => row.summaryKey === selectedSummaryKey.value,
  );

  if (!selectedRow) {
    return sortedFilteredAppointments.value;
  }

  return sortedFilteredAppointments.value.filter((appointment) => {
    const grade = getSummaryGradeBucket(
      appointment.GradeEntering,
      appointment.appointmentDate,
    );
    return (
      grade === selectedRow.GradeEntering &&
      appointment.appointmentTime === selectedRow.appointmentTime
    );
  });
});

const summaryHeaders: Array<{
  title: string;
  align?: "start" | "end" | "center";
  sortable?: boolean;
  value: string;
}> = [
  { title: "Grade", value: "GradeEntering", align: "start" },
  { title: "Appointment Time", value: "appointmentTime", align: "start" },
  { title: "Count", value: "count", align: "start" },
];

const appointmentHeaders: Array<{
  title: string;
  align?: "start" | "end" | "center";
  sortable?: boolean;
  value: string;
}> = [
  { title: "Link", value: "submissionId", align: "start" },
  { title: "First Name", value: "FirstName", align: "start" },
  { title: "Last Name", value: "LastName", align: "start" },
  { title: "Grade", value: "GradeEntering", align: "start" },
  { title: "Appointment Date", value: "appointmentDate", align: "start" },
  { title: "Appointment Time", value: "appointmentTime", align: "start" },
];
</script>

<template>
  <v-container>
    <v-toolbar flat class="mb-4 px-0">
      <v-toolbar-title>Appointments (Latest by Submission)</v-toolbar-title>
      <v-spacer></v-spacer>
      <NuxtLink to="/admin">
        <v-btn color="primary" variant="outlined" class="mr-2">
          <v-icon start>mdi-arrow-left</v-icon>
          Back to Admin
        </v-btn>
      </NuxtLink>
      <v-btn
        color="primary"
        variant="outlined"
        :loading="pending"
        @click="refresh"
      >
        <v-icon start>mdi-refresh</v-icon>
        Refresh
      </v-btn>
    </v-toolbar>

    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedAppointmentDate"
          :items="appointmentDateOptions"
          label="Filter by Appointment Date"
          variant="outlined"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mb-6" variant="tonal">
      Failed to load latest appointments.
    </v-alert>

    <v-data-table
      :headers="summaryHeaders"
      :items="summaryRows"
      item-key="summaryKey"
      class="elevation-1 mb-6"
      :loading="pending"
      :row-props="getSummaryRowProps"
      @click:row="onSummaryRowClick"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title
            >Summary by Grade and Appointment Time</v-toolbar-title
          >
        </v-toolbar>
      </template>
    </v-data-table>

    <v-data-table
      :headers="appointmentHeaders"
      :items="detailAppointments"
      item-key="_id"
      class="elevation-1"
      :loading="pending"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Latest Appointments</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-chip
            v-if="selectedSummaryKey"
            color="primary"
            variant="tonal"
            class="mr-2"
          >
            Filtered by selected summary row
          </v-chip>
          <v-btn
            v-if="selectedSummaryKey"
            variant="text"
            @click="clearSummarySelection"
          >
            Clear Row Filter
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.submissionId`]="{ item }">
        <a
          :href="`https://dpscd.submittable.com/submissions/${item.submissionId}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
        </a>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>
:deep(.summary-row) {
  cursor: pointer;
}

:deep(.summary-row--active) {
  background-color: rgba(var(--v-theme-primary), 0.12);
}
</style>
