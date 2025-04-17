
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <>
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
    </>
  );
};

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
