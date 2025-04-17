
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/sonner";
import { 
  Soldier, 
  TranscriptionResult, 
  OpenAIWhisperResponse, 
  OpenAIGPTResponse 
} from "@/types/tccc";
import { ArrowLeft, Mic, MicOff } from "lucide-react";

interface TCCCCardFormProps {
  soldier: Soldier;
  onBack: () => void;
}

const TCCCCardForm = ({ soldier, onBack }: TCCCCardFormProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("");
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const startRecording = async () => {
    try {
      if (!openAIKey) {
        toast.error("Please enter your OpenAI API key first");
        return;
      }

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
  
  const processAudio = async () => {
    try {
      setRecordingStatus("Transcribing with OpenAI Whisper...");
      
      // Create audio blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create a form to send to the OpenAI API
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model", "whisper-1");
      
      // Call the OpenAI Whisper API
      const whisperResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIKey}`
        },
        body: formData
      });
      
      if (!whisperResponse.ok) {
        throw new Error(`Whisper API error: ${whisperResponse.status}`);
      }
      
      const whisperData = await whisperResponse.json() as OpenAIWhisperResponse;
      const transcript = whisperData.text;
      
      setRecordingStatus("Processing transcript with GPT...");
      
      // Prepare the GPT prompt
      const gptPrompt = {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a medical assistant helping to extract information from a spoken report about a patient. Extract the following details if present: name, rosterNumber (battle roster number), serviceBranch, unit, gender, dateTime, allergies, injury (mechanism of injury), injuryLocations, pulse, bloodPressure, respiratoryRate, pulseOx, painScale, treatments. Format your response as a valid JSON object with these keys."
          },
          {
            role: "user",
            content: transcript
          }
        ]
      };
      
      // Call the OpenAI GPT API
      const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(gptPrompt)
      });
      
      if (!gptResponse.ok) {
        throw new Error(`GPT API error: ${gptResponse.status}`);
      }
      
      const gptData = await gptResponse.json() as OpenAIGPTResponse;
      const content = gptData.choices[0].message.content;
      
      // Parse the GPT response
      let parsedResult: TranscriptionResult;
      try {
        parsedResult = JSON.parse(content);
      } catch (error) {
        console.error("Error parsing GPT response:", error);
        throw new Error("Failed to parse structured data from GPT response");
      }
      
      // Update the form with the parsed information
      updateFormWithTranscription(parsedResult);
      
      setRecordingStatus("Transcription complete. Fields updated.");
      
      // Clear status after a few seconds
      setTimeout(() => {
        setRecordingStatus("");
      }, 3000);
      
    } catch (error) {
      console.error("Error processing audio:", error);
      setRecordingStatus(`Error processing audio: ${error instanceof Error ? error.message : "Unknown error"}`);
      setTimeout(() => {
        setRecordingStatus("");
      }, 5000);
    }
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
      if (result.injury && result.injury.length > 0) {
        const injuryMechanisms = result.injury;
        const validMechanisms = ["Artillery", "Blunt", "Burn", "Fall", "Grenade", "GSW", "IED", "Landmine", "MVC", "RPG", "Other"];
        
        // Add any recognized injury mechanisms
        const recognizedMechanisms = injuryMechanisms.filter(mechanism => 
          validMechanisms.some(valid => mechanism.toLowerCase().includes(valid.toLowerCase()))
        );
        
        if (recognizedMechanisms.length > 0) {
          newData.mechanismOfInjury = [...new Set([...newData.mechanismOfInjury, ...recognizedMechanisms])];
        }
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
    "Artillery",
    "Blunt",
    "Burn",
    "Fall",
    "Grenade",
    "GSW",
    "IED",
    "Landmine",
    "MVC",
    "RPG",
    "Other"
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
              TACTICAL COMBAT CASUALTY CARE (TCCC) CARD
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
        
        {/* OpenAI API Key Input */}
        <div className="mb-4 p-4 border border-gray-300 rounded">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="openAIKey" className="mb-2 block text-sm font-medium">OpenAI API Key (required for voice processing)</Label>
              <Input 
                id="openAIKey"
                type="password"
                value={openAIKey}
                onChange={handleOpenAIKeyChange}
                placeholder="sk-..."
                className="border-gray-300"
              />
            </div>
            <div>
              <a 
                href="https://platform.openai.com/account/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                Get your API key
              </a>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Your API key is only used for API calls and is not stored.</p>
        </div>
        
        {recordingStatus && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-center text-blue-800">
            {recordingStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="multiple" className="w-full space-y-4">
            {/* Header Section - Always visible */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="battleRosterNumber" className="text-base font-bold uppercase">
                      BATTLE ROSTER #:
                    </Label>
                  </div>
                  <Input
                    id="battleRosterNumber"
                    value={formData.battleRosterNumber}
                    onChange={handleInputChange}
                    className="border-2 border-military-light-gray"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base font-bold uppercase">
                    EVAC:
                  </Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="evac-urgent" 
                        checked={formData.evacuationStatus === "Urgent"}
                        onCheckedChange={() => handleEvacuationStatusChange("Urgent")}
                      />
                      <label htmlFor="evac-urgent" className="text-sm">Urgent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="evac-priority" 
                        checked={formData.evacuationStatus === "Priority"}
                        onCheckedChange={() => handleEvacuationStatusChange("Priority")}
                      />
                      <label htmlFor="evac-priority" className="text-sm">Priority</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="evac-routine" 
                        checked={formData.evacuationStatus === "Routine"}
                        onCheckedChange={() => handleEvacuationStatusChange("Routine")}
                      />
                      <label htmlFor="evac-routine" className="text-sm">Routine</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-bold uppercase">
                    NAME (Last, First):
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-2 border-military-light-gray"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-base font-bold uppercase">
                    GENDER:
                  </Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gender-male" 
                        checked={formData.gender === "Male"}
                        onCheckedChange={(checked) => {
                          if (checked) setFormData(prev => ({ ...prev, gender: "Male" }));
                        }}
                      />
                      <label htmlFor="gender-male" className="text-sm">M</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gender-female" 
                        checked={formData.gender === "Female"}
                        onCheckedChange={(checked) => {
                          if (checked) setFormData(prev => ({ ...prev, gender: "Female" }));
                        }}
                      />
                      <label htmlFor="gender-female" className="text-sm">F</label>
                    </div>
                    <div className="flex-grow">
                      <Label htmlFor="dateTime" className="text-base font-bold uppercase">
                        DATE & TIME:
                      </Label>
                      <Input
                        id="dateTime"
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={handleInputChange}
                        className="border-2 border-military-light-gray"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceBranch" className="text-base font-bold uppercase">
                    SERVICE:
                  </Label>
                  <Input
                    id="serviceBranch"
                    value={formData.serviceBranch}
                    onChange={handleInputChange}
                    className="border-2 border-military-light-gray"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex space-x-4">
                    <div className="flex-grow">
                      <Label htmlFor="unit" className="text-base font-bold uppercase">
                        UNIT:
                      </Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="border-2 border-military-light-gray"
                      />
                    </div>
                    <div className="flex-grow">
                      <Label htmlFor="allergies" className="text-base font-bold uppercase">
                        ALLERGIES:
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
              </div>
            </div>
            
            {/* Mechanism of Injury Section */}
            <AccordionItem value="injury" className="border border-gray-300 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-2 bg-military-light-gray text-military-dark-gray font-bold text-lg uppercase hover:no-underline">
                Mechanism of Injury: (X all that apply)
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-white">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                          className="text-sm cursor-pointer"
                        >
                          {injury}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="injuryLocations" className="font-bold uppercase">
                      Injury: (Mark injuries with an X)
                    </Label>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                      <div className="flex-1">
                        <Textarea
                          id="injuryLocations"
                          value={formData.injuryLocations}
                          onChange={handleInputChange}
                          placeholder="Describe injury locations and details..."
                          className="min-h-[100px] border-2 border-military-light-gray"
                        />
                      </div>
                      <div className="flex justify-center">
                        <div className="border border-gray-300 p-3 rounded-md">
                          <img 
                            src="/lovable-uploads/4dedf7a9-8ae7-46bc-82e4-71448513a87a.png" 
                            alt="Body diagram" 
                            className="max-h-[300px] object-contain" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Vital Signs Section */}
            <AccordionItem value="vitals" className="border border-gray-300 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-2 bg-military-light-gray text-military-dark-gray font-bold text-lg uppercase hover:no-underline">
                Signs & Symptoms: (Fill in the blank)
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-white">
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                          <th className="border border-gray-300 px-4 py-2"></th>
                          <th className="border border-gray-300 px-4 py-2"></th>
                          <th className="border border-gray-300 px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Pulse (Rate & Location)</td>
                          <td className="border border-gray-300 px-2 py-2">
                            <Input
                              id="pulse"
                              value={formData.pulse}
                              onChange={handleInputChange}
                              placeholder="e.g., 80 bpm, radial"
                              className="border-0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Blood Pressure</td>
                          <td className="border border-gray-300 px-2 py-2">
                            <Input
                              id="bloodPressure"
                              value={formData.bloodPressure}
                              onChange={handleInputChange}
                              placeholder="e.g., 120/80"
                              className="border-0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">/</td>
                          <td className="border border-gray-300 px-2 py-2">/</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Respiratory Rate</td>
                          <td className="border border-gray-300 px-2 py-2">
                            <Input
                              id="respiratoryRate"
                              value={formData.respiratoryRate}
                              onChange={handleInputChange}
                              placeholder="e.g., 16 breaths/min"
                              className="border-0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Pulse Ox % O2 Sat</td>
                          <td className="border border-gray-300 px-2 py-2">
                            <Input
                              id="pulseOx"
                              value={formData.pulseOx}
                              onChange={handleInputChange}
                              placeholder="e.g., 98%"
                              className="border-0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">Pain Scale (0-10)</td>
                          <td className="border border-gray-300 px-2 py-2">
                            <Input
                              id="painScale"
                              value={formData.painScale}
                              onChange={handleInputChange}
                              placeholder="0 = No Pain, 10 = Worst Pain"
                              className="border-0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Treatments Section */}
            <AccordionItem value="treatments" className="border border-gray-300 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-2 bg-military-light-gray text-military-dark-gray font-bold text-lg uppercase hover:no-underline">
                Treatments: (X all that apply, and fill in the blank)
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-white">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-bold">C: TQ- </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="tq-extremity" />
                          <Label htmlFor="tq-extremity" className="text-sm">Extremity</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="tq-junctional" />
                          <Label htmlFor="tq-junctional" className="text-sm">Junctional</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="tq-truncal" />
                          <Label htmlFor="tq-truncal" className="text-sm">Truncal</Label>
                        </div>
                      </div>
                      
                      <h3 className="font-bold">Dressing- </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="dressing-hemostatic" />
                          <Label htmlFor="dressing-hemostatic" className="text-sm">Hemostatic</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="dressing-pressure" />
                          <Label htmlFor="dressing-pressure" className="text-sm">Pressure</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="dressing-other" />
                          <Label htmlFor="dressing-other" className="text-sm">Other</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-bold">A: </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="a-intact" />
                          <Label htmlFor="a-intact" className="text-sm">Intact</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="a-npa" />
                          <Label htmlFor="a-npa" className="text-sm">NPA</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="a-cric" />
                          <Label htmlFor="a-cric" className="text-sm">CRIC</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="a-et-tube" />
                          <Label htmlFor="a-et-tube" className="text-sm">ET-Tube</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="a-sga" />
                          <Label htmlFor="a-sga" className="text-sm">SGA</Label>
                        </div>
                      </div>
                      
                      <h3 className="font-bold">B: </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="b-o2" />
                          <Label htmlFor="b-o2" className="text-sm">O2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="b-needle-d" />
                          <Label htmlFor="b-needle-d" className="text-sm">Needle-D</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="b-chest-tube" />
                          <Label htmlFor="b-chest-tube" className="text-sm">Chest-Tube</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="b-chest-seal" />
                          <Label htmlFor="b-chest-seal" className="text-sm">Chest-Seal</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-4 py-2">Fluid</th>
                          <th className="border border-gray-300 px-4 py-2">Name</th>
                          <th className="border border-gray-300 px-4 py-2">Volume</th>
                          <th className="border border-gray-300 px-4 py-2">Route</th>
                          <th className="border border-gray-300 px-4 py-2">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Blood Product</td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="font-bold mt-4">MEDS:</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-4 py-2"></th>
                          <th className="border border-gray-300 px-4 py-2">Name</th>
                          <th className="border border-gray-300 px-4 py-2">Dose</th>
                          <th className="border border-gray-300 px-4 py-2">Route</th>
                          <th className="border border-gray-300 px-4 py-2">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">
                            Analgesic<br/>
                            <span className="text-xs">(e.g., Ketamine, Fentanyl, Morphine)</span>
                          </td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">
                            Antibiotic<br/>
                            <span className="text-xs">(e.g., Moxifloxacin, Ertapenem)</span>
                          </td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">
                            Other<br/>
                            <span className="text-xs">(e.g., TXA)</span>
                          </td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                          <td className="border border-gray-300 px-2 py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    <h3 className="font-bold col-span-full">OTHER:</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other-combat-pill-pack" />
                      <Label htmlFor="other-combat-pill-pack" className="text-sm">Combat-Pill-Pack</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other-eye-shield" />
                      <Label htmlFor="other-eye-shield" className="text-sm">Eye-Shield</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other-splint" />
                      <Label htmlFor="other-splint" className="text-sm">Splint</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other-hypothermia-prevention" />
                      <Label htmlFor="other-hypothermia-prevention" className="text-sm">Hypothermia-Prevention</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="notes" className="font-bold">NOTES:</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="min-h-[100px] border-2 border-military-light-gray w-full"
                    />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="firstResponderName" className="font-bold">FIRST RESPONDER NAME (Last, First):</Label>
                    <Input
                      id="firstResponderName"
                      value={formData.firstResponderName}
                      onChange={handleInputChange}
                      className="border-2 border-military-light-gray"
                    />
                  </div>
                  
                  <div className="flex justify-center mt-4 text-xs text-gray-500">
                    DD Form 1380, MAR 2014
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
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
