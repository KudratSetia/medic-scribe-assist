
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Soldier } from "@/types/tccc";
import { mockSoldiers } from "@/data/mockSoldiers";
import { Search, Plus } from "lucide-react";

interface SoldierSearchProps {
  onSelectSoldier: (soldier: Soldier) => void;
  onCreateNewSoldier: () => void;
}

const SoldierSearch = ({ onSelectSoldier, onCreateNewSoldier }: SoldierSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSoldiers, setFilteredSoldiers] = useState<Soldier[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockSoldiers.filter((soldier) =>
        soldier.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSoldiers(filtered);
      setShowDropdown(true);
    } else {
      setFilteredSoldiers([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectSoldier = (soldier: Soldier) => {
    setSearchTerm(soldier.name);
    setShowDropdown(false);
    onSelectSoldier(soldier);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="p-6 shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-military-dark-gray">
          Digital TCCC Card System
        </h2>
        <div className="relative">
          <div className="flex mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for a soldier by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-3 text-lg border-2 border-military-light-gray focus:border-military-green"
                autoFocus
              />
            </div>
            <Button
              onClick={onCreateNewSoldier}
              className="ml-2 px-4 bg-military-green hover:bg-military-dark-green text-white flex items-center"
            >
              <Plus className="mr-1 h-5 w-5" />
              <span className="hidden sm:inline">New Soldier</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>

          {showDropdown && filteredSoldiers.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredSoldiers.map((soldier) => (
                <div
                  key={soldier.id}
                  onClick={() => handleSelectSoldier(soldier)}
                  className="px-4 py-3 hover:bg-military-light-gray cursor-pointer border-b border-gray-100 last:border-b-0 flex flex-col"
                >
                  <span className="font-medium">{soldier.name}</span>
                  <span className="text-sm text-gray-500">
                    {soldier.serviceBranch}, {soldier.unit}
                  </span>
                </div>
              ))}
            </div>
          )}

          {showDropdown && searchTerm && filteredSoldiers.length === 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <div className="px-4 py-3 text-center">
                <p className="text-gray-600 mb-2">No soldiers found matching "{searchTerm}"</p>
                <Button
                  onClick={onCreateNewSoldier}
                  className="bg-military-green hover:bg-military-dark-green text-white"
                >
                  Create new soldier profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SoldierSearch;
