
import { useState, useRef, useEffect } from "react";
import { TranscriptionResult, OpenAIWhisperResponse, OpenAIGPTResponse } from "@/types/tccc";
import { toast } from "@/components/ui/sonner";

interface UseAudioRecordingProps {
  openAIKey: string;
  onTranscriptionComplete: (result: TranscriptionResult) => void;
}

export const useAudioRecording = ({ openAIKey, onTranscriptionComplete }: UseAudioRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      if (!openAIKey) {
        toast.error("Please enter your OpenAI API key first");
        return;
      }

      // Validate OpenAI API key format (simple check)
      if (!openAIKey.startsWith('sk-')) {
        toast.error("Invalid OpenAI API key format. Keys typically start with 'sk-'");
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
      toast.error("Could not access microphone. Check browser permissions.");
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
      if (audioChunksRef.current.length === 0) {
        setRecordingStatus("No audio data recorded. Please try again.");
        toast.error("No audio recorded. Please try again.");
        return;
      }

      setRecordingStatus("Transcribing with OpenAI Whisper...");
      
      // Create audio blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create a form to send to the OpenAI API
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model", "whisper-1");
      
      // Call the OpenAI Whisper API with proper error handling
      const whisperResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIKey}`
        },
        body: formData
      });
      
      if (!whisperResponse.ok) {
        const errorText = await whisperResponse.text();
        console.error("OpenAI Whisper API error:", whisperResponse.status, errorText);
        throw new Error(`OpenAI API error (${whisperResponse.status}): ${errorText || 'Could not transcribe audio'}`);
      }
      
      const whisperData = await whisperResponse.json() as OpenAIWhisperResponse;
      const transcript = whisperData.text;
      
      if (!transcript || transcript.trim() === "") {
        setRecordingStatus("No speech detected in recording. Please try again.");
        toast.error("No speech detected. Please try again.");
        return;
      }
      
      setRecordingStatus("Processing transcript with GPT...");
      
      // Prepare the GPT prompt
      const gptPrompt = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a medical assistant helping to extract information from a spoken report about a patient. Extract the following details if present: name, rosterNumber (battle roster number), serviceBranch, unit, gender, dateTime, allergies, injury (mechanism of injury), injuryLocations, pulse, bloodPressure, respiratoryRate, pulseOx, painScale, treatments. Format your response as a valid JSON object with these keys. Do not include markdown formatting or code blocks."
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
        const errorText = await gptResponse.text();
        console.error("OpenAI GPT API error:", gptResponse.status, errorText);
        throw new Error(`OpenAI API error (${gptResponse.status}): ${errorText || 'Could not process transcript'}`);
      }
      
      const gptData = await gptResponse.json() as OpenAIGPTResponse;
      let content = gptData.choices[0].message.content;
      
      // Clean up the response - remove markdown code block indicators if present
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      // Parse the GPT response
      let parsedResult: TranscriptionResult;
      try {
        parsedResult = JSON.parse(content);
        console.log("Successfully parsed result:", parsedResult);
      } catch (error) {
        console.error("Error parsing GPT response:", error);
        console.error("Raw content:", content);
        toast.error("Could not parse AI response. Please try again.");
        throw new Error("Failed to parse structured data from GPT response");
      }
      
      // Update the form with the parsed information
      onTranscriptionComplete(parsedResult);
      
      setRecordingStatus("Transcription complete. Fields updated.");
      toast.success("Transcription completed successfully!");
      
      // Clear status after a few seconds
      setTimeout(() => {
        setRecordingStatus("");
      }, 3000);
      
    } catch (error) {
      console.error("Error processing audio:", error);
      setRecordingStatus(`Error processing audio: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast.error(`Error: ${error instanceof Error ? error.message : "Failed to process audio"}`);
      setTimeout(() => {
        setRecordingStatus("");
      }, 5000);
    }
  };

  return {
    isRecording,
    recordingStatus,
    startRecording,
    stopRecording
  };
};
