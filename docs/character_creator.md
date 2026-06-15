# Character Creator — How it works

A walkthrough of the character creation wizard, written so someone who didn't
build it can read, change, and extend it confidently.

The wizard lives at **`/characters/create`** ([app/characters/create/page.tsx](../src/app/characters/create/page.tsx)).
It's a single-page form: pick a class, species, and background; make the
sub-choices each one unlocks; set ability scores; and submit to create a level 1
character.

---

## The one rule: components render, utils compute

The feature is split across two layers, and the split is the most important
thing to understand:

| Layer | Where | Job |
|---|---|---|
| **View** | `src/components/character-builder/` | React only — render UI, hold local UI state (which modal is open), forward events. No D&D logic. |
| **Domain** | `src/utils/character/` | Pure functions — normalize API shapes, derive HP/AC, aggregate proficiencies, build the API payload. No React, no fetching. Unit-tested. |

If you're adding a *calculation* (a new derived value, a new way to group
choices), it goes in `utils/character/`. If you're adding *something on screen*,
it goes in a component. When a component needs a computed value, it calls a
domain function — it never computes inline. `ProficienciesPanel` is the model
example: it calls `aggregateProficiencies(...)` and just renders the result.

Everything in `utils/character/` is re-exported from its barrel, so components
import from `@/utils/character` (not the individual files).

---

## File map

```
src/
├── app/characters/create/page.tsx          — Route entry (renders <CharacterBuilderForm/>)
│
├── components/character-builder/            — VIEW layer
│   ├── index.ts                             — barrel: exports CharacterBuilderForm
│   ├── CharacterBuilderForm.tsx             — the form: RHF setup + JSX. Logic lives in the hook.
│   ├── useCharacterBuilder.ts               — the hook: fetching, derivations, builds the `sections` array
│   ├── sections.config.ts                   — static section metadata (CHARACTER_SECTIONS, FIELD_BY_KEY)
│   ├── cards/
│   │   ├── CharacterCreationCard.tsx        — card shell for class/species/background + HP/AC
│   │   ├── CharacterDetailsCard.tsx         — name / alignment / pronouns inputs
│   │   └── OptionCard.tsx                   — one selectable option inside a modal
│   ├── modals/
│   │   ├── ChoiceModal.tsx                  — generic modal (single or multi-select)
│   │   └── OptionCardList.tsx               — grid of OptionCards + confirm button
│   ├── choices/
│   │   └── ChoiceTags.tsx                   — row of sub-choice tags; opens a ChoiceModal
│   └── panels/
│       ├── ProficienciesPanel.tsx           — render-only; calls aggregateProficiencies()
│       └── ProficiencyCard.tsx              — one labelled tag group (Skills / Armor / Feats)
│
├── utils/character/                         — DOMAIN layer (all re-exported from index.ts)
│   ├── normalize-choices.ts                 — API template → ActiveChoice[] (drives the choice tags)
│   ├── list-items.ts                        — mapClass/mapSpecies/mapBackground → OptionItem shape
│   ├── choices.ts                           — shared helpers: asArray, resolveSelected, bucketChosenByType, …
│   ├── proficiencies.ts                     — aggregateProficiencies(): the panel's data
│   ├── derive.ts                            — deriveAc()
│   ├── stats.ts                             — abilityModifier(), deriveMaxHp(), formatReferenceKey()
│   ├── backend-enums.ts                     — toPascalCase() for backend enum names
│   ├── feature-labels.ts                    — label constants used to find choices by name
│   ├── build-payload.ts                     — buildCreateCharacterPayload(): form → API request
│   └── __fixtures__/ + *.test.ts            — Vitest tests + shared fixtures
│
├── utils/api/
│   ├── character-options.ts                 — fetch functions (lists + templates)
│   └── character-images.ts                  — API id → StaticImageData lookup tables
└── models/
    ├── schemas/character-builder.ts         — Zod schemas mirroring API shapes
    └── types/character-builder.types.ts     — types inferred from the schemas
```

---

## End-to-end data flow

1. **On mount, fetch the lists.** `useCharacterBuilder` calls `fetchClasses()`,
   `fetchSpecies()`, `fetchBackgrounds()` once. These are lightweight — just
   enough (id, name, a few tags) to populate the selection modals.

2. **Build the `sections` array.** The hook maps `CHARACTER_SECTIONS` into one
   `sections` array, each entry carrying its option `list` (via `mapClass`/etc.),
   the current `selectedId`/`selectedName`/`selectedImage`, its form `field`, and
   its normalized `choices`. The form JSX maps over this once for the cards and
   once for the modals — no per-section `if`/ternary branching.

3. **User picks an option.** Clicking a card opens its `ChoiceModal` with that
   section's list. Confirming calls `setValue("classId" | "speciesId" |
   "backgroundId", id)` and closes the modal.

4. **The id change fetches the full template.** A `useEffect` per section fetches
   the heavy template (`fetchClass`, `fetchSpeciesByKey`, `fetchBackground`) when
   its id changes. The template holds the class features, traits, and sub-choices.

5. **Template → choice tags.** `normalizeClassChoices` / `normalizeSpeciesChoices`
   / `normalizeBackgroundChoices` flatten a template's nested choice structure
   into a uniform `ActiveChoice[]` (see below). `ChoiceTags` renders one tag per
   entry; clicking opens a sub-choice `ChoiceModal`.

6. **Sub-choice confirm writes to `form.choices`.** Every sub-choice lands in a
   flat `Record<string, string | string[]>` keyed by the choice's `key`
   (`setValue(`choices.${key}`, value)`).

7. **Live derivations.** As scores and choices change, the hook recomputes
   `derivedHp` (`deriveMaxHp`), `derivedAc` (`deriveAc`, using
   `resolveChosenEquipmentKeys` to read armor out of the chosen equipment bundle),
   and the panel recomputes proficiencies (`aggregateProficiencies`).

8. **Submit.** `buildCreateCharacterPayload(form, { templates, derivedHp,
   derivedAc })` turns everything into the backend's request shape and `POST`s via
   `createCharacter`.

---

## The tricky bits, explained plainly

### The nested API choice shape
A template's sub-choice looks like this (simplified):

```
choice: {
  id: { value: "fighter-skills" },     // the key we store selections under
  numberOfChoices: 2,                  // how many the user must pick
  choiceGroups: [                      // usually 1 group; >1 means "pick a bundle"
    { id, label: "A", groupContents: [ { referenceKey: "acrobatics", type: "SkillProficiency", quantity: 1 }, … ] }
  ]
}
```

- **One group** → the user picks individual `groupContents` (e.g. two skills).
- **Multiple groups** → the user picks *which group* (e.g. equipment bundle A vs B);
  the selected value is the group id, and we read the items inside it.

`normalize-choices.ts` is the only place that has to understand this — it turns
it into a flat `ActiveChoice` (`{ key, title, numberOfChoices, options }`) the UI
can render without knowing the nesting.

### Why `bucketChosenByType` exists
The backend tags each option with a `type` (`SkillProficiency`, `Feat`,
`WeaponMastery`, `Size`, `Trait`, …). The user's selections arrive as a flat map
of reference keys. To show "these chosen items are skills, those are feats", we
group the chosen keys by their type — that's `bucketChosenByType` in `choices.ts`.
Both the proficiencies panel and the payload builder need this; the panel also
tracks the *origin* (which class/species granted it) for its "(Fighter)" labels.

### PascalCase for the backend
The API returns reference keys in kebab-case (`great-weapon-fighting`) but its C#
enums expect PascalCase member names (`GreatWeaponFighting`). `toPascalCase` in
`backend-enums.ts` does that conversion, and it only happens in `build-payload.ts`
on the way *out*. Inside the app we keep the raw keys; `formatReferenceKey` makes
them human-readable (`Great Weapon Fighting`) for display only.

### Prefilled single-option choices
If a choice has exactly as many options as `numberOfChoices` (e.g. "pick 1 of 1"),
there's nothing to decide. `normalize-choices.ts` marks it with a
`prefilledValue`, and the hook auto-writes it into the form so the tag shows as
done without the user clicking.

---

## How to add a class / species / background

1. The C# team adds it to the API. No frontend schema change is needed if the
   shape matches the existing Zod schemas.
2. Add an image to `public/assets/` and register it in
   [character-images.ts](../src/utils/api/character-images.ts) keyed by the API
   `id`.
3. Done. The list, selection modal, template fetch, choice tags, derivations, and
   payload all pick it up automatically.

If the API introduces a **new feature/choice label** you need to find by name
(like "Starting Equipment"), add it to `FEATURE_LABELS` in
[feature-labels.ts](../src/utils/character/feature-labels.ts).

---

## Where new logic goes

| You're adding… | Put it in… |
|---|---|
| A new derived value (e.g. initiative) | `utils/character/derive.ts` (or a new util), surfaced via the hook |
| A new way to group/aggregate choices | `utils/character/` + a unit test |
| A new selectable card or panel | the matching `components/character-builder/<role>/` folder |
| A new field in the API payload | `build-payload.ts` (+ update its test) |
| A new top-level section | `sections.config.ts` + the hook's per-key maps |

---

## Tests

`utils/character/` is covered by Vitest (`npm run test`):
- `build-payload.test.ts` — the form → payload mapping (the regression guard for
  anything that touches the submit path).
- `proficiencies.test.ts` — the panel's aggregation.

Both share realistic fighter/human/soldier fixtures in
`utils/character/__fixtures__/character-templates.ts`. Add cases there when you
change derivation or payload logic.

### Verifying the UI by hand
1. `npm run dev`, open `/characters/create`.
2. Before picking a class, HP says "Choose a class" and AC shows the unarmored
   value (10 + DEX modifier).
3. Pick a class/species/background — choice tags appear; pick their sub-choices.
4. Change CON/DEX — HP/AC update live. The proficiencies panel reflects every
   grant.
5. Fill everything and submit — a character is created.
