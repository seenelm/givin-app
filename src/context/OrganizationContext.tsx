import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

interface OrganizationData {
  name: string;
  ein: string;
  mission: string;
  onboardingCompleted: boolean;
}

interface OrganizationContextType {
  organization: OrganizationData;
  updateOrganization: (data: Partial<OrganizationData>) => void;
  isOnboardingCompleted: () => boolean;
}

const defaultOrganizationData: OrganizationData = {
  name: '',
  ein: '',
  mission: '',
  onboardingCompleted: false,
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organization, setOrganization] = useState<OrganizationData>(() => {
    // Try to load from localStorage on initial render
    const savedData = localStorage.getItem('organizationData');
    return savedData ? JSON.parse(savedData) : defaultOrganizationData;
  });

  // Save to localStorage whenever organization data changes
  useEffect(() => {
    localStorage.setItem('organizationData', JSON.stringify(organization));
  }, [organization]);

  const updateOrganization = (data: Partial<OrganizationData>) => {
    setOrganization(prev => ({ ...prev, ...data }));
  };

  const isOnboardingCompleted = () => {
    return organization.onboardingCompleted;
  };

  return (
    <OrganizationContext.Provider value={{ organization, updateOrganization, isOnboardingCompleted }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
