
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MechanismOfInjurySectionProps {
  formData: {
    mechanismOfInjury: string[];
    injuryLocations: string;
  };
  handleCheckboxChange: (injury: string, checked: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const MechanismOfInjurySection = ({
  formData,
  handleCheckboxChange,
  handleInputChange,
}: MechanismOfInjurySectionProps) => {
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
  );
};
