
export interface Soldier {
  id: string;
  name: string;
  battleRosterNumber: string;
  serviceBranch: string;
  unit: string;
  gender: string;
  dateTime: string;
  allergies: string;
}

export interface TCCCCard {
  soldierId: string;
  mechanismOfInjury: string[];
  injuryLocations: string;
  vitalSigns: {
    pulse: string;
    bloodPressure: string;
    respiratoryRate: string;
    pulseOx: string;
    painScale: string;
  };
  treatmentsAdministered: string;
}

export interface TranscriptionResult {
  name?: string;
  rosterNumber?: string;
  serviceBranch?: string;
  unit?: string;
  gender?: string;
  dateTime?: string;
  allergies?: string;
  injury?: string[];
  injuryLocations?: string;
  pulse?: string;
  bloodPressure?: string;
  respiratoryRate?: string;
  pulseOx?: string;
  painScale?: string;
  treatments?: string;
}
