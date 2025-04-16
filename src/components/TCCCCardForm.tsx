
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Soldier, TranscriptionResult } from "@/types/tccc";
import { ArrowLeft, ChevronDown, ChevronUp, Mic, MicOff } from "lucide-react";

interface TCCCCardFormProps {
  soldier: Soldier;
  onBack: () => void;
}

const TCCCCardForm = ({ soldier, onBack }: TCCCCardFormProps) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    injury: false,
    vitals: false,
    treatments: false,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("");
  const [formData, setFormData] = useState({
    // Basic info from soldier
    name: soldier.name,
    battleRosterNumber: soldier.battleRosterNumber,
    serviceBranch: soldier.serviceBranch,
    unit: soldier.unit,
    gender: soldier.gender,
    dateTime: soldier.dateTime,
    allergies: soldier.allergies,
    
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
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  const startRecording = async () => {
    try {
      setRecordingStatus("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setRecordingStatus("Recording... Speak clearly");
      setIsRecording(true);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        processAudio();
      };
      
      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecordingStatus("Microphone access denied. Please check your browser permissions.");
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setRecordingStatus("Processing audio...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const processAudio = () => {
    // Simulate API call to OpenAI Whisper and GPT
    setRecordingStatus("Transcribing and processing...");
    
    // Simulate delay for API processing
    setTimeout(() => {
      // Mock response from GPT that would parse the transcript
      const mockResult: TranscriptionResult = {
        pulse: "88 bpm, radial",
        bloodPressure: "124/82",
        respiratoryRate: "18",
        pulseOx: "97%",
        painScale: "6",
        injuryLocations: "Left lower extremity, shrapnel wounds to right arm",
        treatments: "Applied tourniquet to left thigh at 14:30. Administered 10mg morphine IV at 14:32."
      };
      
      updateFormWithTranscription(mockResult);
      setRecordingStatus("Transcription complete. Fields updated.");
      
      // Clear status after a few seconds
      setTimeout(() => {
        setRecordingStatus("");
      }, 3000);
    }, 2000);
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
      
      // Auto-expand relevant sections based on transcription
      if (result.injuryLocations) {
        setExpandedSections(prev => ({ ...prev, injury: true }));
      }
      
      if (result.pulse || result.bloodPressure || result.respiratoryRate || 
          result.pulseOx || result.painScale) {
        setExpandedSections(prev => ({ ...prev, vitals: true }));
      }
      
      if (result.treatments) {
        setExpandedSections(prev => ({ ...prev, treatments: true }));
      }
      
      return newData;
    });
    
    toast.success("Form fields updated from voice input");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("TCCC Card saved successfully");
  };

  const injuryMechanisms = [
    "Gunshot Wound",
    "Explosion/Blast",
    "Shrapnel",
    "Burn",
    "Fall",
    "Crush",
    "Blunt Force",
    "Stab/Cut",
    "Chemical",
    "Drowning",
    "Vehicle Accident"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card className="p-6 shadow-lg bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4 text-military-dark-gray"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-military-dark-gray">
              TCCC Card
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={startRecording}
              disabled={isRecording}
              className={`${
                isRecording ? "bg-gray-400" : "bg-military-green hover:bg-military-dark-green"
              } text-white px-4 py-2`}
            >
              <Mic className={`mr-2 h-5 w-5 ${isRecording ? "animate-pulse-recording" : ""}`} />
              Start Recording
            </Button>
            <Button
              onClick={stopRecording}
              disabled={!isRecording}
              className={`${
                !isRecording ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
              } text-white px-4 py-2`}
            >
              <MicOff className="mr-2 h-5 w-5" />
              Stop Recording
            </Button>
          </div>
        </div>
        
        {recordingStatus && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-center text-blue-800">
            {recordingStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("basic")}
              className="w-full flex justify-between items-center p-4 bg-military-light-gray text-military-dark-gray font-medium text-lg"
            >
              Soldier Information
              {expandedSections.basic ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.basic && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-military-dark-gray">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-2 border-military-light-gray"
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="battleRosterNumber" className="text-sm font-medium text-military-dark-gray">
                      Battle Roster Number
                    </Label>
                    <Input
                      id="battleRosterNumber"
                      value={formData.battleRosterNumber}
                      onChange={handleInputChange}
                      className="border-2 border-military-light-gray"
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serviceBranch" className="text-sm font-medium text-military-dark-gray">
                      Service Branch
                    </Label>
                    <Input
                      id="serviceBranch"
                      value={formData.serviceBranch}
                      onChange={handleInputChange}
                      className="border-2 border-military-light-gray"
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-sm font-medium text-military-dark-gray">
                      Unit
                    </Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="border-2 border-military-light-gray"
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-military-dark-gray">
                      Gender
                    </Label>
                    <Input
                      id="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="border-2 border-military-light-gray"
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateTime" className="text-sm font-medium text-military-dark-gray">
                      Date & Time
                    </Label>
                    <Input
                      id="dateTime"
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={handleInputChange}
                      className="border-2 border-military-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="allergies" className="text-sm font-medium text-military-dark-gray">
                      Allergies
                    </Label>
                    <Input
                      id="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="border-2 border-military-light-gray"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Mechanism of Injury Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("injury")}
              className="w-full flex justify-between items-center p-4 bg-military-light-gray text-military-dark-gray font-medium text-lg"
            >
              Mechanism of Injury & Locations
              {expandedSections.injury ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.injury && (
              <div className="p-4 bg-white">
                <div className="space-y-4">
                  <h3 className="font-medium text-military-dark-gray">Mechanism of Injury</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {injuryMechanisms.map((injury) => (
                      <div key={injury} className="flex items-center space-x-2">
                        <Checkbox
                          id={`injury-${injury}`}
                          checked={formData.mechanismOfInjury.includes(injury)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(injury, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`injury-${injury}`}
                          className="text-sm text-military-dark-gray cursor-pointer"
                        >
                          {injury}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="injuryLocations" className="font-medium text-military-dark-gray">
                      Injury Locations & Description
                    </Label>
                    <Textarea
                      id="injuryLocations"
                      value={formData.injuryLocations}
                      onChange={handleInputChange}
                      placeholder="Describe injury locations and details..."
                      className="min-h-[100px] border-2 border-military-light-gray"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <div className="border border-gray-300 p-3 rounded-md max-w-sm">
                      <img 
                        src="/lovable-uploads/7b692867-af70-4c58-8324-26fa43f0edce.png" 
                        alt="Body diagram" 
                        className="max-h-[300px] object-contain" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Vital Signs Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("vitals")}
              className="w-full flex justify-between items-center p-4 bg-military-light-gray text-military-dark-gray font-medium text-lg"
            >
              Vital Signs
              {expandedSections.vitals ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.vitals && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pulse" className="text-sm font-medium text-military-dark-gray">
                      Pulse (Rate & Location)
                    </Label>
                    <Input
                      id="pulse"
                      value={formData.pulse}
                      onChange={handleInputChange}
                      placeholder="e.g., 80 bpm, radial"
                      className="border-2 border-military-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure" className="text-sm font-medium text-military-dark-gray">
                      Blood Pressure
                    </Label>
                    <Input
                      id="bloodPressure"
                      value={formData.bloodPressure}
                      onChange={handleInputChange}
                      placeholder="e.g., 120/80"
                      className="border-2 border-military-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="respiratoryRate" className="text-sm font-medium text-military-dark-gray">
                      Respiratory Rate
                    </Label>
                    <Input
                      id="respiratoryRate"
                      value={formData.respiratoryRate}
                      onChange={handleInputChange}
                      placeholder="e.g., 16 breaths/min"
                      className="border-2 border-military-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pulseOx" className="text-sm font-medium text-military-dark-gray">
                      Pulse Ox % O2 Sat
                    </Label>
                    <Input
                      id="pulseOx"
                      value={formData.pulseOx}
                      onChange={handleInputChange}
                      placeholder="e.g., 98%"
                      className="border-2 border-military-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="painScale" className="text-sm font-medium text-military-dark-gray">
                      Pain Scale (0-10)
                    </Label>
                    <Input
                      id="painScale"
                      value={formData.painScale}
                      onChange={handleInputChange}
                      placeholder="0 = No Pain, 10 = Worst Pain"
                      className="border-2 border-military-light-gray"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Treatments Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("treatments")}
              className="w-full flex justify-between items-center p-4 bg-military-light-gray text-military-dark-gray font-medium text-lg"
            >
              Treatments Administered
              {expandedSections.treatments ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {expandedSections.treatments && (
              <div className="p-4 bg-white">
                <div className="space-y-2">
                  <Label htmlFor="treatmentsAdministered" className="text-sm font-medium text-military-dark-gray">
                    Document all interventions with times
                  </Label>
                  <Textarea
                    id="treatmentsAdministered"
                    value={formData.treatmentsAdministered}
                    onChange={handleInputChange}
                    placeholder="e.g., Tourniquet applied to left thigh at 14:30, 10mg morphine IV at 14:32..."
                    className="min-h-[150px] border-2 border-military-light-gray"
                  />
                </div>
              </div>
            )}
          </div>
          
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
