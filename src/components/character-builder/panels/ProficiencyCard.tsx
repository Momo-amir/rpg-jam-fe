"use client";

import { Tag } from "@/components/ui/tag";
import type { LabeledItem } from "@/utils/character";

interface ProficiencyCardProps {
  icon: React.ReactNode;
  label: string;
  items: LabeledItem[];
  emptyText: string;
}

// One labelled group of proficiencies (Skills, Armor & Weapons, Feats & Traits)
// rendered as a tag list, or an empty-state hint when nothing is granted yet.
export function ProficiencyCard({
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
              label={item.origin ? `${item.value} (${item.origin})` : item.value}
            />
          ))}
        </div>
      ) : (
        <p className='text-helper text-primary/40'>{emptyText}</p>
      )}
    </div>
  );
}
