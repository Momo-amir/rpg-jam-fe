# Character Creator — How it works

This document explains the data and UI flow for the character creation wizard.

---

## Overview

The character creator is a single-page form at `/characters/new`. Three concerns:

1. **Fetching lists** — what classes/species/backgrounds exist (populates the selection modals)
2. **Fetching templates** — the full data for a selected option (drives the choice tags)
3. **The form** — React Hook Form tracks all selections and sub-choices, validated by Zod

---

## File map

```
src/
├── app/characters/new/page.tsx              — Route entry point (Server Component)
├── components/character-builder/
│   ├── CharacterBuilderForm.tsx             — All form state and data fetching lives here
│   ├── CharacterCreationCard.tsx            — Card shell for class/species/background
│   ├── ChoiceTags.tsx                       — Row of tags + sub-choice modal, takes ActiveChoice[]
│   ├── normalizeChoices.ts                  — Converts any template's choices[] into ActiveChoice[]
│   ├── ChoiceModal.tsx                      — Generic modal (single or multi-select)
│   ├── OptionCardList.tsx                   — Grid of selectable cards inside a modal
│   ├── OptionCard.tsx                       — Individual card (image, name, description)
│   └── character-sections.config.tsx        — Static config for the three main sections
├── utils/api/
│   ├── character-options.ts                 — All fetch functions
│   └── character-images.ts                  — Frontend image map: API id → StaticImageData
├── models/
│   ├── schemas/character-builder.ts         — Zod schemas mirroring API response shapes
│   └── types/character-builder.types.ts     — TypeScript types inferred from the schemas
```

---

## How it works end to end

### 1. On mount — fetch the lists

All three lists are fetched once on mount. These are lightweight — just enough to fill the selection modals (id, name, description).

```ts
Promise.all([fetchClasses(), fetchSpecies(), fetchBackgrounds()])
```

### 2. User picks a section — opens the selection modal

Clicking a card opens a `ChoiceModal` with that section's list. Confirming writes the chosen `id` into the form (`classId`, `speciesId`, `backgroundId`) and closes the modal.

### 3. ID change triggers a template fetch

Each section ID has a `useEffect` that fetches the full template when it changes:

```ts
useEffect(() => {
  if (!classId) return;
  fetchClass(classId).then(setClassTemplate);
}, [classId]);
```

Species and background follow the exact same pattern with `fetchSpeciesById` and `fetchBackground`.

### 4. Template → choice tags

Once a template is loaded, `normalizeChoices(template)` converts its `choices[]` into a flat `ActiveChoice[]`:

```ts
interface ActiveChoice {
  key: string;          // written into form.choices[key] on confirm
  title: string;        // tag label and modal title
  numberOfChoices: number;
  options: string[];
}
```

This is passed to `ChoiceTags`, which renders a tag per entry and opens a sub-choice modal on click.

### 5. Sub-choice confirm — writes into form.choices

`onChoiceConfirm(key, value)` calls `setValue(`choices.${key}`, value)`. All sub-choices land in a flat `Record<string, string | string[]>` keyed by the choice's `key`.

---

## normalizeChoices

`normalizeChoices` in [normalizeChoices.ts](../src/components/character-builder/normalizeChoices.ts) handles the inconsistency in the API shape — `classFeatures` and `specialTraits` are arrays of named objects, while `skillProficiencies` and `size` are plain `{ numberOfChoices, options }` fields. It irons these out into a uniform `ActiveChoice[]`.

The function accepts any template type structurally: `{ choices?: Record<string, unknown>[] }`. This means `ClassTemplate`, `SpeciesTemplate`, and `BackgroundTemplate` all satisfy it without needing a union type.

Two internal type guards do the narrowing:
- `isNamedItem` — matches `classFeatures` / `specialTraits` entries (have `name`, `numberOfChoices`, `options`)
- `isFlatItem` — matches plain choice fields like `skillProficiencies`, `size`, `toolProficiency`

Flat options can be either `string` or `{ label: string }` — `optionLabel` normalises both to a string. This covers `startingEquipment` which uses the object shape.

It skips any entry where `numberOfChoices === 0` or `options` is empty — those are display-only, not interactive choices.

`CHOICE_LABELS` inside it maps API field names to human-readable titles. Add entries there when the API introduces new flat field names.

When the API is updated to return a flat `choices[]` with consistent shape, `normalizeChoices` can be deleted and `ChoiceTags` can consume `template.choices` directly.

---

## sections array

All per-section data is computed once into a `sections` array before the JSX:

```ts
const sections = CHARACTER_SECTIONS.map((section) => ({
  ...section,       // label, icon, placeholderImage, modalTitle
  list,             // OptionItem[] for the selection modal
  selectedId,       // current form value
  selectedName,     // display name for the card header
  field,            // "classId" | "speciesId" | "backgroundId"
  choices,          // ActiveChoice[] from normalizeChoices
}));
```

The JSX maps over this once for the cards and once for the modals — no per-section conditionals.

---

## Form data shape

```ts
{
  name: string
  classId: string
  speciesId: string
  subspeciesId?: string
  backgroundId: string
  abilityScores: { strength, dexterity, constitution, intelligence, wisdom, charisma }
  choices: Record<string, string | string[]>  // sub-choices keyed by choice key
  proficiencies: string[]
  alignment?: string
  pronouns?: string
  portraitUrl?: string
}
```

---

## Ticket: Wire up derived HP and AC cards

**Goal:** Make the Hit Points and Armor Class cards show real values that react to the user's class selection and ability scores.

**Background:** At level 1 in D&D 5e, HP equals the class's hit die maximum plus the character's Constitution modifier. AC (unarmored) equals 10 plus the Dexterity modifier. The ability modifier formula is `Math.floor((score - 10) / 2)` — a score of 10 gives +0, 12 gives +1, 8 gives -1, and so on.

All the data you need is already in the form. `classTemplate` (from `useState`) holds the fetched class including `hitDie`. The ability scores live in the form under `abilityScores.constitution` and `abilityScores.dexterity`. The trick is making the component re-render when those scores change — that's what `useWatch` is for.

---

### Step 1 — Watch the ability scores

Open [CharacterBuilderForm.tsx](../src/components/character-builder/CharacterBuilderForm.tsx).

Find where the other `useWatch` calls are (around line 89). Add one more underneath them:

```ts
const abilityScores = useWatch({ control, name: "abilityScores" });
```

`useWatch` subscribes the component to changes in that field. Without it, React won't re-render when scores change, so your derived values would be stale.

---

### Step 2 — Derive the modifier values

Below your `useWatch` calls, but before the JSX `return`, add these two lines:

```ts
const conMod = Math.floor(((abilityScores?.constitution ?? 10) - 10) / 2);
const dexMod = Math.floor(((abilityScores?.dexterity ?? 10) - 10) / 2);
```

The `?.` is optional chaining — safe if `abilityScores` is undefined on first render. The `?? 10` is a nullish coalescing fallback — if the value is null or undefined, use 10 (the neutral score that gives a +0 modifier).

---

### Step 3 — Derive HP and AC

Directly below step 2, add:

```ts
const derivedHp = classTemplate ? classTemplate.hitDie + conMod : null;
const derivedAc = 10 + dexMod;
```

`classTemplate` is null until the user picks a class. The ternary handles that — `null` means "not ready yet". AC always has a value because 10 + DEX modifier is always valid.

---

### Step 4 — Use the values in the cards

Find the two `CharacterCreationCard` components with `label='Hit Points'` and `label='Armor Class'` (around line 252). Update their `description` props:

```tsx
<CharacterCreationCard
  label='Hit Points'
  description={derivedHp !== null ? `${derivedHp} HP` : "Choose a class first"}
  icon={<Heart size={20} />}
  className='h-full'
/>
<CharacterCreationCard
  label='Armor Class'
  description={`${derivedAc} AC`}
  icon={<Shield size={20} />}
  className='h-full'
/>
```

Template literals (the backtick strings) let you embed the number directly into the display string.

---

### How to verify it works

1. Run the dev server and open `/characters/new`
2. Before selecting a class, the HP card should say "Choose a class first" and AC should say "10 AC"
3. Select a class — HP should update to the hit die value (e.g. Fighter shows 10, Wizard shows 6)
4. Once ability score inputs are wired up, changing CON or DEX should update the numbers live

---

## Adding a new class/species/background

1. C# team adds it to the API — no frontend schema changes needed if the shape matches.
2. Add an image to `public/assets/` and register it in `character-images.ts` using the API `id` as the key.
3. Done. The list, modal, template fetch, and choice tags all pick it up automatically.
