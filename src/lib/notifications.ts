import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, addMinutes, isAfter, parseISO, setHours, setMinutes, startOfDay } from "date-fns";
import { Event, Medication } from "@/types/stepio";
import { getMedicationSchedule } from "@/utils/medicationUtils";

const CHANNEL_ID = "stepio-reminders";

function isNative() {
  return Capacitor.isNativePlatform();
}

function hashId(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

async function ensureChannel() {
  if (!isNative()) return;
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: "Lembretes Stepio",
      description: "Notificações de compromissos e remédios",
      importance: 4,
      visibility: 1,
    });
  } catch {
    // channel may already exist
  }
}

async function ensurePermissions() {
  if (!isNative()) return;
  await LocalNotifications.requestPermissions();
  await ensureChannel();
}

async function clearAll() {
  if (!isNative()) return;
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length === 0) return;
  await LocalNotifications.cancel({
    notifications: pending.notifications.map((n) => ({ id: n.id })),
  });
}

function buildId(key: string) {
  return hashId(key);
}

export async function scheduleEventNotifications(event: Event) {
  if (!isNative()) return;
  await ensurePermissions();

  const base = parseISO(event.datetime);
  const offsets = [
    { label: "1 dia", minutes: -24 * 60 },
    { label: "30 min", minutes: -30 },
  ];

  const notifications = offsets
    .map((offset) => {
      const at = addMinutes(base, offset.minutes);
      return { offset, at };
    })
    .filter(({ at }) => isAfter(at, new Date()))
    .map(({ offset, at }) => ({
      id: buildId(`event:${event.id}:${offset.minutes}`),
      title: "Compromisso chegando",
      body: `${event.title} em ${offset.label}`,
      schedule: { at },
      channelId: CHANNEL_ID,
    }));

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
}

export async function cancelEventNotifications(event: Event) {
  if (!isNative()) return;
  const ids = [-24 * 60, -30].map((offset) => ({ id: buildId(`event:${event.id}:${offset}`) }));
  await LocalNotifications.cancel({ notifications: ids });
}

export async function scheduleMedicationNotifications(medication: Medication) {
  if (!isNative()) return;
  await ensurePermissions();

  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfDay(now), i));
  const times = getMedicationSchedule(medication);

  const notifications = [];

  for (const day of days) {
    for (const time of times) {
      const [h, m] = time.split(":").map(Number);
      const base = setMinutes(setHours(day, h), m);
      const reminders = [
        { label: "1h", minutes: -60 },
        { label: "5 min", minutes: -5 },
      ];

      for (const offset of reminders) {
        const at = addMinutes(base, offset.minutes);
        if (!isAfter(at, now)) continue;
        const id = buildId(`med:${medication.id}:${day.toISOString().slice(0, 10)}:${time}:${offset.minutes}`);
        notifications.push({
          id,
          title: "Hora do remédio",
          body: `${medication.name} em ${offset.label}`,
          schedule: { at },
          channelId: CHANNEL_ID,
        });
      }
    }
  }

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
}

export async function cancelMedicationNotifications(medication: Medication) {
  if (!isNative()) return;
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfDay(now), i));
  const times = getMedicationSchedule(medication);
  const ids = [];
  for (const day of days) {
    for (const time of times) {
      const id1 = buildId(`med:${medication.id}:${day.toISOString().slice(0, 10)}:${time}:-60`);
      const id2 = buildId(`med:${medication.id}:${day.toISOString().slice(0, 10)}:${time}:-5`);
      ids.push({ id: id1 }, { id: id2 });
    }
  }
  await LocalNotifications.cancel({ notifications: ids });
}

export async function rescheduleAll(events: Event[], medications: Medication[], notifyEvents: boolean, notifyMeds: boolean) {
  if (!isNative()) return;
  await clearAll();
  if (notifyEvents) {
    for (const event of events) {
      await scheduleEventNotifications(event);
    }
  }
  if (notifyMeds) {
    for (const med of medications) {
      await scheduleMedicationNotifications(med);
    }
  }
}
