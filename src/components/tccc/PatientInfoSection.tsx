
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PatientInfoSectionProps {
  formData: {
    battleRosterNumber: string;
    evacuationStatus: "Urgent" | "Priority" | "Routine" | "";
    name: string;
    gender: string;
    dateTime: string;
    serviceBranch: string;
    unit: string;
    allergies: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleEvacuationStatusChange: (status: "Urgent" | "Priority" | "Routine") => void;
}

export const PatientInfoSection = ({
  formData,
  handleInputChange,
  handleEvacuationStatusChange,
}: PatientInfoSectionProps) => {
  return (
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
                  if (checked) handleInputChange({ target: { id: 'gender', value: 'Male' }} as React.ChangeEvent<HTMLInputElement>);
                }}
              />
              <label htmlFor="gender-male" className="text-sm">M</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gender-female" 
                checked={formData.gender === "Female"}
                onCheckedChange={(checked) => {
                  if (checked) handleInputChange({ target: { id: 'gender', value: 'Female' }} as React.ChangeEvent<HTMLInputElement>);
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
  );
};
