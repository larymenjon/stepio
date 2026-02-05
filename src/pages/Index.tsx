import { useStepioData } from '@/hooks/useStepioData';
import { OnboardingWizard } from '@/components/wizard/OnboardingWizard';
import { Home } from './Home';
import { Medicacao } from './Medicacao';
import { Agenda } from './Agenda';
import { Terapias } from './Terapias';
import { BottomNav } from '@/components/BottomNav';
import { useLocation } from 'react-router-dom';
import { ConditionType } from '@/types/stepio';

const Index = () => {
  const location = useLocation();
  const {
    data,
    loading,
    setUser,
    setChild,
    completeOnboarding,
    addMedication,
    deleteMedication,
    addEvent,
    deleteEvent,
  } = useStepioData();

  const handleOnboardingComplete = (onboardingData: {
    userName: string;
    childName: string;
    birthDate: string;
    gender: 'menina' | 'menino' | 'nao_informar';
    conditions: ConditionType[];
  }) => {
    setUser({ name: onboardingData.userName });
    setChild({
      name: onboardingData.childName,
      birthDate: onboardingData.birthDate,
      condition: onboardingData.conditions,
      gender: onboardingData.gender,
    });
    completeOnboarding();
  };

  // Show onboarding wizard if not completed
  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!data.isOnboarded || !data.user || !data.child) {
    return (
      <div className="mobile-container">
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Render current page based on route
  const renderPage = () => {
    switch (location.pathname) {
      case '/medicacao':
        return (
          <Medicacao
            medications={data.medications}
            onAdd={addMedication}
            onDelete={deleteMedication}
          />
        );
      case '/agenda':
        return (
          <Agenda
            events={data.events}
            onAdd={addEvent}
            onDelete={deleteEvent}
          />
        );
      case '/marcos':
        return (
          <Terapias
            events={data.events}
            onAdd={addEvent}
            onDelete={deleteEvent}
          />
        );
      case '/terapias':
        return (
          <Terapias
            events={data.events}
            onAdd={addEvent}
            onDelete={deleteEvent}
          />
        );
      default:
        return (
          <Home
            user={data.user}
            child={data.child}
            medications={data.medications}
            events={data.events}
          />
        );
    }
  };

  return (
    <div className="mobile-container">
      {renderPage()}
      <BottomNav />
    </div>
  );
};

export default Index;
