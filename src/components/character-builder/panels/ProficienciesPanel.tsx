"use client";

import { BookOpen, Shield, Sparkles } from "lucide-react";
import type {
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/types/character";
import { aggregateProficiencies, type SelectedChoices } from "@/utils/character";
import { ProficiencyCard } from "@/components/character-builder/panels/ProficiencyCard";

interface ProficienciesPanelProps {
  classTemplate: ClassTemplate | null;
  speciesTemplate: SpeciesTemplate | null;
  backgroundTemplate: BackgroundTemplate | null;
  choices: SelectedChoices;
}

// Pure view: hands the templates + choices to aggregateProficiencies() and
// renders the three resulting groups. All the gathering logic lives in
// @/utils/character/proficiencies.ts.
export function ProficienciesPanel({
  classTemplate,
  speciesTemplate,
  backgroundTemplate,
  choices,
}: ProficienciesPanelProps) {
  const { skills, armorAndWeapons, featsAndTraits } = aggregateProficiencies(
    classTemplate,
    speciesTemplate,
    backgroundTemplate,
    choices,
  );

  return (
    <div className='col-span-6 row-start-3 flex flex-col gap-3 md:col-span-2 md:col-start-5'>
      <ProficiencyCard
        icon={<BookOpen size={16} />}
        label='Skills'
        items={skills}
        emptyText='Choose a class and background to see skill proficiencies.'
      />
      <ProficiencyCard
        icon={<Shield size={16} />}
        label='Armor & Weapons'
        items={armorAndWeapons}
        emptyText='Choose a class to see armor and weapon training.'
      />
      <ProficiencyCard
        icon={<Sparkles size={16} />}
        label='Feats & Traits'
        items={featsAndTraits}
        emptyText='Choose a background and species to see feats and traits.'
      />
    </div>
  );
}
