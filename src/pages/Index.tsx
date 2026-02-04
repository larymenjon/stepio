import { useStepioData } from '@/hooks/useStepioData';
import { OnboardingWizard } from '@/components/wizard/OnboardingWizard';
import { Home } from './Home';
import { Medicacao } from './Medicacao';
import { Agenda } from './Agenda';
import { Marcos } from './Marcos';
import { BottomNav } from '@/components/BottomNav';
import { useLocation } from 'react-router-dom';
import { ConditionType } from '@/types/stepio';

const Index = () => {
  const location = useLocation();
  const {
    data,
    setUser,
    setChild,
    completeOnboarding,
    addMedication,
    deleteMedication,
    addEvent,
    deleteEvent,
    addMilestone,
    deleteMilestone,
  } = useStepioData();

  const handleOnboardingComplete = (onboardingData: {
    userName: string;
    childName: string;
    birthDate: string;
    conditions: ConditionType[];
  }) => {
    setUser({ name: onboardingData.userName });
    setChild({
      name: onboardingData.childName,
      birthDate: onboardingData.birthDate,
      condition: onboardingData.conditions,
    });
    completeOnboarding();
  };

  // Show onboarding wizard if not completed
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
          <Marcos
            milestones={data.milestones}
            onAdd={addMilestone}
            onDelete={deleteMilestone}
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
