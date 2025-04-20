
import { Mic, MicOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoiceRecordingControlsProps {
  isRecording: boolean;
  recordingStatus: string;
  startRecording: () => void;
  stopRecording: () => void;
  openAIKey: string;
  handleOpenAIKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VoiceRecordingControls = ({
  isRecording,
  recordingStatus,
  startRecording,
  stopRecording,
  openAIKey,
  handleOpenAIKeyChange,
}: VoiceRecordingControlsProps) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      {/* OpenAI API Key Input */}
      <div className="p-4 border border-gray-300 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
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
        
        <div className="mt-2">
          <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Your API key is used only for AI processing and is not stored. Make sure it's valid and has access to Whisper and GPT-4o models.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      
      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button
          onClick={startRecording}
          disabled={isRecording || !openAIKey}
          className={`${
            isRecording || !openAIKey ? "bg-gray-400" : "bg-military-green hover:bg-military-dark-green"
          } text-white px-4 py-2 w-full sm:w-auto`}
        >
          <Mic className={`mr-2 h-5 w-5 ${isRecording ? "animate-pulse-recording" : ""}`} />
          Start Recording
        </Button>
        <Button
          onClick={stopRecording}
          disabled={!isRecording}
          className={`${
            !isRecording ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
          } text-white px-4 py-2 w-full sm:w-auto`}
        >
          <MicOff className="mr-2 h-5 w-5" />
          Stop Recording
        </Button>
      </div>
      
      {/* Recording Status */}
      {recordingStatus && (
        <div className={`p-3 rounded-md text-center ${
          recordingStatus.includes("Error") 
            ? "bg-red-50 border border-red-200 text-red-800" 
            : "bg-blue-50 border border-blue-200 text-blue-800"
        }`}>
          {recordingStatus}
        </div>
      )}
      
      {/* Usage Instructions */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
        <p className="font-medium mb-1">Recording Tips:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Speak clearly and at a moderate pace</li>
          <li>Include patient details, injuries, vital signs, and treatments</li>
          <li>Use standard medical terminology when possible</li>
          <li>For best results, record in a quiet environment</li>
        </ul>
      </div>
    </div>
  );
};
