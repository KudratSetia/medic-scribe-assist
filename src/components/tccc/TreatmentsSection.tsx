
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TreatmentsSectionProps {
  formData: {
    treatmentsAdministered: string;
    firstResponderName: string;
    notes: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const TreatmentsSection = ({
  formData,
  handleInputChange,
}: TreatmentsSectionProps) => {
  return (
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
  );
};
