
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Soldier } from "@/types/tccc";
import { ArrowLeft, Save } from "lucide-react";

interface CreateSoldierFormProps {
  onBack: () => void;
  onSave: (soldier: Soldier) => void;
}

const CreateSoldierForm = ({ onBack, onSave }: CreateSoldierFormProps) => {
  const [soldier, setSoldier] = useState<Partial<Soldier>>({
    id: `${Date.now()}`, // Generate a simple ID
    dateTime: new Date().toISOString().slice(0, 16) // Current date and time
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSoldier((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(soldier as Soldier);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-6 shadow-lg bg-white">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4 text-military-dark-gray"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold text-military-dark-gray">
            Create New Soldier Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-military-dark-gray">
                Full Name *
              </label>
              <Input
                id="name"
                value={soldier.name || ""}
                onChange={handleChange}
                placeholder="Enter full name"
                className="border-2 border-military-light-gray"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="battleRosterNumber"
                className="text-sm font-medium text-military-dark-gray"
              >
                Battle Roster Number *
              </label>
              <Input
                id="battleRosterNumber"
                value={soldier.battleRosterNumber || ""}
                onChange={handleChange}
                placeholder="Enter roster number"
                className="border-2 border-military-light-gray"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="serviceBranch"
                className="text-sm font-medium text-military-dark-gray"
              >
                Service Branch *
              </label>
              <Input
                id="serviceBranch"
                value={soldier.serviceBranch || ""}
                onChange={handleChange}
                placeholder="Army, Marines, etc."
                className="border-2 border-military-light-gray"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="unit" className="text-sm font-medium text-military-dark-gray">
                Unit *
              </label>
              <Input
                id="unit"
                value={soldier.unit || ""}
                onChange={handleChange}
                placeholder="Enter unit"
                className="border-2 border-military-light-gray"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium text-military-dark-gray">
                Gender
              </label>
              <Input
                id="gender"
                value={soldier.gender || ""}
                onChange={handleChange}
                placeholder="Enter gender"
                className="border-2 border-military-light-gray"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dateTime" className="text-sm font-medium text-military-dark-gray">
                Date & Time
              </label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={soldier.dateTime || ""}
                onChange={handleChange}
                className="border-2 border-military-light-gray"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="allergies" className="text-sm font-medium text-military-dark-gray">
                Allergies
              </label>
              <Input
                id="allergies"
                value={soldier.allergies || ""}
                onChange={handleChange}
                placeholder="Enter allergies or 'None'"
                className="border-2 border-military-light-gray"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-military-green hover:bg-military-dark-green text-white px-6 py-2"
            >
              <Save className="mr-2 h-5 w-5" />
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateSoldierForm;
