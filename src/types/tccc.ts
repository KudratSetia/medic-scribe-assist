
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
  evacuationStatus?: "Urgent" | "Priority" | "Routine" | "";
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
  firstResponderName?: string;
  notes?: string;
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
  firstResponderName?: string;
  notes?: string;
}

export interface OpenAIWhisperResponse {
  text: string;
}

export interface OpenAIGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
