
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TCCCCardHeaderProps {
  onBack: () => void;
}

export const TCCCCardHeader = ({ onBack }: TCCCCardHeaderProps) => {
  return (
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
    </div>
  );
};
