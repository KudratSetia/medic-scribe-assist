
import { Input } from "@/components/ui/input";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface VitalSignsSectionProps {
  formData: {
    pulse: string;
    bloodPressure: string;
    respiratoryRate: string;
    pulseOx: string;
    painScale: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const VitalSignsSection = ({
  formData,
  handleInputChange,
}: VitalSignsSectionProps) => {
  return (
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
  );
};
