
import { useState } from "react";
import { Soldier } from "@/types/tccc";
import SoldierSearch from "@/components/SoldierSearch";
import CreateSoldierForm from "@/components/CreateSoldierForm";
import TCCCCardForm from "@/components/TCCCCardForm";

enum AppView {
  SEARCH,
  CREATE_SOLDIER,
  TCCC_CARD
}

const Index = () => {
  const [view, setView] = useState<AppView>(AppView.SEARCH);
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);

  const handleSelectSoldier = (soldier: Soldier) => {
    setSelectedSoldier(soldier);
    setView(AppView.TCCC_CARD);
  };

  const handleCreateNewSoldier = () => {
    setView(AppView.CREATE_SOLDIER);
  };

  const handleSaveSoldier = (soldier: Soldier) => {
    setSelectedSoldier(soldier);
    setView(AppView.TCCC_CARD);
  };

  const handleBackToSearch = () => {
    setView(AppView.SEARCH);
    setSelectedSoldier(null);
  };

  return (
    <div className="min-h-screen bg-military-light-gray p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-military-dark-gray text-center">
            Tactical Combat Casualty Care
          </h1>
          <p className="text-center text-military-gray mt-2">
            Digital TCCC Card System for Battlefield Medics
          </p>
        </header>

        <main>
          {view === AppView.SEARCH && (
            <SoldierSearch
              onSelectSoldier={handleSelectSoldier}
              onCreateNewSoldier={handleCreateNewSoldier}
            />
          )}

          {view === AppView.CREATE_SOLDIER && (
            <CreateSoldierForm
              onBack={handleBackToSearch}
              onSave={handleSaveSoldier}
            />
          )}

          {view === AppView.TCCC_CARD && selectedSoldier && (
            <TCCCCardForm
              soldier={selectedSoldier}
              onBack={handleBackToSearch}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
