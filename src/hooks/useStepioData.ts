import { useState, useEffect, useCallback } from 'react';
import { StepioData, User, Child, Medication, Event, Milestone } from '@/types/stepio';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  scheduleEventNotifications,
  cancelEventNotifications,
  scheduleMedicationNotifications,
  cancelMedicationNotifications,
  rescheduleAll,
} from '@/lib/notifications';

const defaultData: StepioData = {
  user: null,
  child: null,
  medications: [],
  events: [],
  milestones: [],
  dailyLogs: {},
  plan: {
    tier: 'free',
    status: 'inactive',
  },
  settings: {
    notifyEvents: true,
    notifyMeds: true,
  },
  isOnboarded: false,
};

export function useStepioData() {
  const { user: authUser } = useAuth();
  const [data, setData] = useState<StepioData>(() => {
    return defaultData;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!authUser) {
        setData(defaultData);
        setLoading(false);
        return;
      }
      setLoading(true);
      const ref = doc(db, 'users', authUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const loaded = snap.data() as StepioData;
        const merged: StepioData = {
          ...defaultData,
          ...loaded,
          settings: {
            ...defaultData.settings,
            ...(loaded.settings ?? {}),
          },
          plan: {
            ...defaultData.plan,
            ...(loaded.plan ?? {}),
          },
          dailyLogs: {
            ...(defaultData.dailyLogs ?? {}),
            ...(loaded.dailyLogs ?? {}),
          },
        };
        setData(merged);
        rescheduleAll(
          merged.events,
          merged.medications,
          merged.settings?.notifyEvents ?? true,
          merged.settings?.notifyMeds ?? true,
        );
      } else {
        const initial: StepioData = {
          ...defaultData,
          user: {
            name: authUser.displayName ?? '',
            email: authUser.email ?? undefined,
          } as User,
        };
        await setDoc(ref, initial);
        setData(initial);
        rescheduleAll(
          initial.events,
          initial.medications,
          initial.settings?.notifyEvents ?? true,
          initial.settings?.notifyMeds ?? true,
        );
      }
      setLoading(false);
    };
    load();
  }, [authUser]);

  const persist = useCallback(
    async (next: StepioData) => {
      if (!authUser) return;
      const ref = doc(db, 'users', authUser.uid);
      await setDoc(ref, next, { merge: true });
    },
    [authUser],
  );

  const setUser = useCallback(
    (user: User) => {
      setData((prev) => {
        const next = { ...prev, user };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const setChild = useCallback(
    (child: Child) => {
      setData((prev) => {
        const next = { ...prev, child };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const completeOnboarding = useCallback(() => {
    setData((prev) => {
      const next = { ...prev, isOnboarded: true };
      persist(next);
      return next;
    });
  }, [persist]);

  const addMedication = useCallback((medication: Omit<Medication, 'id'>) => {
    const newMed: Medication = {
      ...medication,
      id: crypto.randomUUID(),
    };
    setData((prev) => {
      const next = {
        ...prev,
        medications: [...prev.medications, newMed],
      };
      persist(next);
      if (next.settings?.notifyMeds) {
        scheduleMedicationNotifications(newMed);
      }
      return next;
    });
  }, [persist]);

  const updateMedication = useCallback((id: string, medication: Partial<Medication>) => {
    setData((prev) => {
      const existing = prev.medications.find((m) => m.id === id);
      const next = {
        ...prev,
        medications: prev.medications.map((m) =>
          m.id === id ? { ...m, ...medication } : m
        ),
      };
      persist(next);
      const updated = next.medications.find((m) => m.id === id);
      if (existing) {
        cancelMedicationNotifications(existing);
      }
      if (updated && next.settings?.notifyMeds) {
        scheduleMedicationNotifications(updated);
      }
      return next;
    });
  }, [persist]);

  const deleteMedication = useCallback((id: string) => {
    setData((prev) => {
      const existing = prev.medications.find((m) => m.id === id);
      const next = {
        ...prev,
        medications: prev.medications.filter((m) => m.id !== id),
      };
      persist(next);
      if (existing) {
        cancelMedicationNotifications(existing);
      }
      return next;
    });
  }, [persist]);

  const addEvent = useCallback((event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
    };
    setData((prev) => {
      const next = {
        ...prev,
        events: [...prev.events, newEvent],
      };
      persist(next);
      if (next.settings?.notifyEvents) {
        scheduleEventNotifications(newEvent);
      }
      return next;
    });
  }, [persist]);

  const updateEvent = useCallback((id: string, event: Partial<Event>) => {
    setData((prev) => {
      const existing = prev.events.find((e) => e.id === id);
      const next = {
        ...prev,
        events: prev.events.map((e) =>
          e.id === id ? { ...e, ...event } : e
        ),
      };
      persist(next);
      const updated = next.events.find((e) => e.id === id);
      if (existing) {
        cancelEventNotifications(existing);
      }
      if (updated && next.settings?.notifyEvents) {
        scheduleEventNotifications(updated);
      }
      return next;
    });
  }, [persist]);

  const deleteEvent = useCallback((id: string) => {
    setData((prev) => {
      const existing = prev.events.find((e) => e.id === id);
      const next = {
        ...prev,
        events: prev.events.filter((e) => e.id !== id),
      };
      persist(next);
      if (existing) {
        cancelEventNotifications(existing);
      }
      return next;
    });
  }, [persist]);

  const setNotificationSettings = useCallback(
    (settings: { notifyEvents: boolean; notifyMeds: boolean }) => {
      setData((prev) => {
        const next = {
          ...prev,
          settings,
        };
        persist(next);
        rescheduleAll(
          next.events,
          next.medications,
          settings.notifyEvents,
          settings.notifyMeds,
        );
        return next;
      });
    },
    [persist],
  );

  const addMilestone = useCallback((milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: crypto.randomUUID(),
    };
    setData((prev) => {
      const next = {
        ...prev,
        milestones: [...prev.milestones, newMilestone],
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateMilestone = useCallback((id: string, milestone: Partial<Milestone>) => {
    setData((prev) => {
      const next = {
        ...prev,
        milestones: prev.milestones.map((m) =>
          m.id === id ? { ...m, ...milestone } : m
        ),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteMilestone = useCallback((id: string) => {
    setData((prev) => {
      const next = {
        ...prev,
        milestones: prev.milestones.filter((m) => m.id !== id),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const setDailyLog = useCallback(
    (date: string, log: Omit<import('@/types/stepio').DailyLog, 'date'>) => {
      setData((prev) => {
        const nextLogs = {
          ...(prev.dailyLogs ?? {}),
          [date]: {
            ...(prev.dailyLogs?.[date] ?? {}),
            ...log,
            date,
            updatedAt: new Date().toISOString(),
          },
        };
        const next = {
          ...prev,
          dailyLogs: nextLogs,
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const refreshPlan = useCallback(async () => {
    if (!authUser) return;
    const ref = doc(db, 'users', authUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const loaded = snap.data() as StepioData;
    setData((prev) => ({
      ...prev,
      plan: {
        ...defaultData.plan,
        ...(loaded.plan ?? {}),
      },
    }));
  }, [authUser]);

  const resetData = useCallback(() => {
    setData(defaultData);
    persist(defaultData);
  }, [persist]);

  return {
    data,
    loading,
    setUser,
    setChild,
    completeOnboarding,
    setNotificationSettings,
    addMedication,
    updateMedication,
    deleteMedication,
    addEvent,
    updateEvent,
    deleteEvent,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    setDailyLog,
    refreshPlan,
    resetData,
  };
}
