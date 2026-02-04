import { useState, useEffect, useCallback } from 'react';
import { StepioData, User, Child, Medication, Event, Milestone } from '@/types/stepio';

const STORAGE_KEY = 'stepio_data';

const defaultData: StepioData = {
  user: null,
  child: null,
  medications: [],
  events: [],
  milestones: [],
  isOnboarded: false,
};

export function useStepioData() {
  const [data, setData] = useState<StepioData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
    }
    return defaultData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
  }, [data]);

  const setUser = useCallback((user: User) => {
    setData((prev) => ({ ...prev, user }));
  }, []);

  const setChild = useCallback((child: Child) => {
    setData((prev) => ({ ...prev, child }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setData((prev) => ({ ...prev, isOnboarded: true }));
  }, []);

  const addMedication = useCallback((medication: Omit<Medication, 'id'>) => {
    const newMed: Medication = {
      ...medication,
      id: crypto.randomUUID(),
    };
    setData((prev) => ({
      ...prev,
      medications: [...prev.medications, newMed],
    }));
  }, []);

  const updateMedication = useCallback((id: string, medication: Partial<Medication>) => {
    setData((prev) => ({
      ...prev,
      medications: prev.medications.map((m) =>
        m.id === id ? { ...m, ...medication } : m
      ),
    }));
  }, []);

  const deleteMedication = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.id !== id),
    }));
  }, []);

  const addEvent = useCallback((event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
    };
    setData((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  }, []);

  const updateEvent = useCallback((id: string, event: Partial<Event>) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === id ? { ...e, ...event } : e
      ),
    }));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  }, []);

  const addMilestone = useCallback((milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: crypto.randomUUID(),
    };
    setData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
    }));
  }, []);

  const updateMilestone = useCallback((id: string, milestone: Partial<Milestone>) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === id ? { ...m, ...milestone } : m
      ),
    }));
  }, []);

  const deleteMilestone = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    setUser,
    setChild,
    completeOnboarding,
    addMedication,
    updateMedication,
    deleteMedication,
    addEvent,
    updateEvent,
    deleteEvent,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    resetData,
  };
}
