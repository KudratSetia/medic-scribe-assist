
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { toast } from "@/components/ui/sonner";
import { Soldier, TranscriptionResult } from "@/types/tccc";

// Import our newly created components
import { TCCCCardHeader } from "@/components/tccc/TCCCCardHeader";
import { VoiceRecordingControls } from "@/components/tccc/VoiceRecordingControls";
import { PatientInfoSection } from "@/components/tccc/PatientInfoSection";
import { MechanismOfInjurySection } from "@/components/tccc/MechanismOfInjurySection";
import { VitalSignsSection } from "@/components/tccc/VitalSignsSection";
import { TreatmentsSection } from "@/components/tccc/TreatmentsSection";
import { useAudioRecording } from "@/components/tccc/hooks/useAudioRecording";

interface TCCCCardFormProps {
  soldier: Soldier;
  onBack: () => void;
}

const TCCCCardForm = ({ soldier, onBack }: TCCCCardFormProps) => {
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [formData, setFormData] = useState({
    // Basic info from soldier
    name: soldier.name,
    battleRosterNumber: soldier.battleRosterNumber,
    serviceBranch: soldier.serviceBranch,
    unit: soldier.unit,
    gender: soldier.gender,
    dateTime: soldier.dateTime,
    allergies: soldier.allergies,
    
    // Evacuation status
    evacuationStatus: "" as "Urgent" | "Priority" | "Routine" | "",
    
    // Mechanism of injury
    mechanismOfInjury: [] as string[],
    injuryLocations: "",
    
    // Vital signs
    pulse: "",
    bloodPressure: "",
    respiratoryRate: "",
    pulseOx: "",
    painScale: "",
    
    // Treatments
    treatmentsAdministered: "",
    
    // Additional fields from paper form
    firstResponderName: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (injury: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          mechanismOfInjury: [...prev.mechanismOfInjury, injury],
        };
      } else {
        return {
          ...prev,
          mechanismOfInjury: prev.mechanismOfInjury.filter(item => item !== injury),
        };
      }
    });
  };

  const handleEvacuationStatusChange = (status: "Urgent" | "Priority" | "Routine") => {
    setFormData(prev => ({ ...prev, evacuationStatus: status }));
  };

  const handleOpenAIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenAIKey(e.target.value);
  };

  const updateFormWithTranscription = (result: TranscriptionResult) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      
      // Update fields if they exist in the result
      if (result.pulse) newData.pulse = result.pulse;
      if (result.bloodPressure) newData.bloodPressure = result.bloodPressure;
      if (result.respiratoryRate) newData.respiratoryRate = result.respiratoryRate;
      if (result.pulseOx) newData.pulseOx = result.pulseOx;
      if (result.painScale) newData.painScale = result.painScale;
      if (result.injuryLocations) newData.injuryLocations = result.injuryLocations;
      if (result.treatments) newData.treatmentsAdministered = result.treatments;
      
      // If there are injury mechanisms listed, try to map them to our checkbox list
      if (result.injury && Array.isArray(result.injury) && result.injury.length > 0) {
        const injuryMechanisms = result.injury;
        const validMechanisms = ["Artillery", "Blunt", "Burn", "Fall", "Grenade", "GSW", "IED", "Landmine", "MVC", "RPG", "Other"];
        
        // Add any recognized injury mechanisms
        const recognizedMechanisms = injuryMechanisms.filter(mechanism => 
          validMechanisms.some(valid => 
            mechanism && typeof mechanism === 'string' && mechanism.toLowerCase().includes(valid.toLowerCase())
          )
        );
        
        if (recognizedMechanisms.length > 0) {
          newData.mechanismOfInjury = [...new Set([...newData.mechanismOfInjury, ...recognizedMechanisms])];
        }
      }
      
      return newData;
    });
    
    toast.success("Form fields updated from voice input");
  };

  const { isRecording, recordingStatus, startRecording, stopRecording } = useAudioRecording({
    openAIKey,
    onTranscriptionComplete: updateFormWithTranscription
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("TCCC Card saved successfully");
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card className="p-6 shadow-lg bg-white">
        <TCCCCardHeader onBack={onBack} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex-1">
            {/* This div maintains layout spacing */}
          </div>
          <VoiceRecordingControls
            isRecording={isRecording}
            recordingStatus={recordingStatus}
            startRecording={startRecording}
            stopRecording={stopRecording}
            openAIKey={openAIKey}
            handleOpenAIKeyChange={handleOpenAIKeyChange}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="multiple" className="w-full space-y-4">
            {/* Header Section - Always visible */}
            <PatientInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              handleEvacuationStatusChange={handleEvacuationStatusChange}
            />
            
            {/* Mechanism of Injury Section */}
            <MechanismOfInjurySection
              formData={formData}
              handleCheckboxChange={handleCheckboxChange}
              handleInputChange={handleInputChange}
            />
            
            {/* Vital Signs Section */}
            <VitalSignsSection
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            {/* Treatments Section */}
            <TreatmentsSection
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </Accordion>
          
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-military-green hover:bg-military-dark-green text-white px-8 py-3 text-lg"
            >
              Save TCCC Card
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TCCCCardForm;
