"use client";

import { BookOpen, Shield, Sparkles } from "lucide-react";
import { formatReferenceKey } from "@/utils/character";
import { Tag } from "@/components/ui/tag";
import type {
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/models/types/character-builder.types";

import { FEATURE_LABELS } from "./feature-labels";

const SKILL_GRANT_TRAITS = ["Skillful"];
const FEAT_GRANT_TRAITS = ["Versatile"];

interface ProficienciesPanelProps {
  classTemplate: ClassTemplate | null;
  speciesTemplate: SpeciesTemplate | null;
  backgroundTemplate: BackgroundTemplate | null;
  choices: Record<string, string | string[]>;
}

interface LabeledItem {
  value: string;
  origin?: string;
}

interface ProficiencyCardProps {
  icon: React.ReactNode;
  label: string;
  items: LabeledItem[];
  emptyText: string;
}

function ProficiencyCard({
  icon,
  label,
  items,
  emptyText,
}: ProficiencyCardProps) {
  return (
    <div className='flex flex-col gap-3 rounded-xl border border-dashed border-primary/10 bg-surface/60 p-4'>
      <div className='flex items-center gap-2 text-primary/60'>
        {icon}
        <span className='text-helper font-medium uppercase tracking-wider'>
          {label}
        </span>
      </div>
      {items.length > 0 ? (
        <div className='flex flex-wrap gap-1.5'>
          {items.map((item) => (
            <Tag
              key={item.origin ? `${item.value}-${item.origin}` : item.value}
              label={
                item.origin ? `${item.value} (${item.origin})` : item.value
              }
            />
          ))}
        </div>
      ) : (
        <p className='text-helper text-primary/40'>{emptyText}</p>
      )}
    </div>
  );
}

function toStringArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function ProficienciesPanel({
  classTemplate,
  speciesTemplate,
  backgroundTemplate,
  choices,
}: ProficienciesPanelProps) {
  const backgroundSkills: LabeledItem[] = (
    backgroundTemplate?.skillProficiencies ?? []
  ).map((skill) => ({ value: skill, origin: backgroundTemplate?.name }));

  // Skill proficiencies chosen from class-level choices (e.g. "Skill Proficiencies" label)
  const skillChoiceKey = classTemplate?.choices?.find(
    (classChoice) => classChoice.label === FEATURE_LABELS.SKILL_PROFICIENCIES,
  )?.choice.id.value;
  const classChosenSkills: LabeledItem[] = toStringArray(
    skillChoiceKey ? choices[skillChoiceKey] : undefined,
  ).map((referenceKey) => ({
    value: formatReferenceKey(referenceKey),
    origin: classTemplate?.name,
  }));

  const traitGrantedSkills: LabeledItem[] = SKILL_GRANT_TRAITS.flatMap(
    (traitName) =>
      toStringArray(choices[traitName]).map((skill) => ({
        value: skill,
        origin: traitName,
      })),
  );

  const featureChosenByType = bucketChoicesByType(
    (classTemplate?.classFeatures ?? []).map((feature) => ({
      choice: feature.choice ?? null,
      origin: classTemplate?.name,
    })),
    choices,
  );

  const speciesChosenByType = bucketChoicesByType(
    (["size", "lineage", "skillful", "versatile"] as const).map((key) => ({
      choice: speciesTemplate?.[key] ?? null,
      origin: speciesTemplate?.name,
    })),
    choices,
  );

  const featureSkills: LabeledItem[] =
    featureChosenByType["SkillProficiency"] ?? [];
  const featureFeats: LabeledItem[] = featureChosenByType["Feat"] ?? [];
  const featureWeaponMasteries: LabeledItem[] =
    featureChosenByType["WeaponMastery"] ?? [];
  const speciesSkills: LabeledItem[] =
    speciesChosenByType["SkillProficiency"] ?? [];
  const speciesFeats: LabeledItem[] = speciesChosenByType["Feat"] ?? [];

  const savingThrowItems: LabeledItem[] = (
    classTemplate?.savingThrow ?? []
  ).map((safe) => ({ value: `${safe} Save`, origin: classTemplate?.name }));

  const allSkills = dedupeByValue([
    ...backgroundSkills,
    ...classChosenSkills,
    ...featureSkills,
    ...speciesSkills,
    ...traitGrantedSkills,
    ...savingThrowItems,
  ]);

  //  Armor & Weapons
  const armorItems: LabeledItem[] = (classTemplate?.armorTraining ?? []).map(
    (armor) => ({ value: armor }),
  );
  const weaponItems: LabeledItem[] = (
    classTemplate?.weaponProficiency ?? []
  ).map((weapon: string) => ({ value: weapon }));

  //  Feats & Traits
  const backgroundFeat: LabeledItem[] = backgroundTemplate?.feat
    ? [{ value: backgroundTemplate.feat }]
    : [];

  // Show only the chosen tool, not all options. Fall back to nothing if not chosen yet.
  const toolChoiceKey = backgroundTemplate?.toolProficiencies?.id.value;
  const chosenTool = toStringArray(toolChoiceKey ? choices[toolChoiceKey] : undefined);
  const toolItems: LabeledItem[] = chosenTool.map((tool) => ({
    value: formatReferenceKey(tool),
  }));

  // Passive species traits — all traits that don't grant a further choice
  const passiveTraits: LabeledItem[] = (speciesTemplate?.traits ?? [])
    .filter(
      (trait) => !SKILL_GRANT_TRAITS.includes(trait) && !FEAT_GRANT_TRAITS.includes(trait),
    )
    .map((trait) => ({ value: formatReferenceKey(trait) }));

  return (
    <div className='col-span-6 row-start-3 flex flex-col gap-3 md:col-span-2 md:col-start-5'>
      <ProficiencyCard
        icon={<BookOpen size={16} />}
        label='Skills'
        items={allSkills}
        emptyText='Choose a class and background to see skill proficiencies.'
      />
      <ProficiencyCard
        icon={<Shield size={16} />}
        label='Armor & Weapons'
        items={[...armorItems, ...weaponItems, ...featureWeaponMasteries]}
        emptyText='Choose a class to see armor and weapon training.'
      />
      <ProficiencyCard
        icon={<Sparkles size={16} />}
        label='Feats & Traits'
        items={[
          ...backgroundFeat,
          ...featureFeats,
          ...speciesFeats,
          ...toolItems,
          ...passiveTraits,
        ]}
        emptyText='Choose a background and species to see feats and traits.'
      />
    </div>
  );
}

type ChoiceSource = {
  choice: {
    id: { value: string };
    choiceGroups: { groupContents: { referenceKey: string; type: string }[] }[];
  } | null;
  origin: string | undefined;
};

function bucketChoicesByType(
  sources: ChoiceSource[],
  choices: Record<string, string | string[]>,
): Record<string, LabeledItem[]> {
  const result: Record<string, LabeledItem[]> = {};
  for (const { choice, origin } of sources) {
    if (!choice) continue;
    const chosen = toStringArray(choices[choice.id.value]);
    if (!chosen.length) continue;
    const typeByKey: Record<string, string> = {};
    for (const group of choice.choiceGroups) {
      for (const content of group.groupContents) {
        typeByKey[content.referenceKey] = content.type;
      }
    }
    for (const referenceKey of chosen) {
      const type = typeByKey[referenceKey] ?? "Feat";
      if (!result[type]) result[type] = [];
      result[type].push({ value: formatReferenceKey(referenceKey), origin });
    }
  }
  return result;
}

function dedupeByValue(items: LabeledItem[]): LabeledItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
}
