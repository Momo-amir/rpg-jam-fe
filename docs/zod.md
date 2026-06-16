# Types & Zod — how we model data

How this codebase organizes TypeScript types, schemas, and interfaces, and why.
Read this before adding a new type or wondering where one should live.

---

## The one idea: the schema _is_ the type

We use [Zod](https://zod.dev) so that one definition does three jobs at once:

1. **Validation** — check data at runtime (form input, API responses).
2. **Parsing** — turn `unknown` JSON into a typed value, throwing if it's wrong.
3. **The TypeScript type** — inferred from the schema, so it can never drift.

Instead of writing a TypeScript `interface` _and_ a separate runtime check that
can fall out of sync, you write the schema once and infer the type from it:

```ts
import { z } from "zod";

export const userSchema = z.object({
  identifier: z.string(),
  displayName: z.string(),
  email: z.email(),
});

export type User = z.infer<typeof userSchema>;
```

`User` is now `{ identifier: string; displayName: string; email: string }` — and
if you add a field to the schema, the type updates automatically. The schema and
its inferred type **always live in the same file**, right next to each other.
See [src/types/user.ts](../src/types/user.ts) for this exact example.

---

## Where types live

Everything that isn't a component-prop type lives under **`src/types/`**.

```
src/types/
├── character/        # big domain → a folder of small files + a barrel
│   ├── enums.ts        ability/skill/weapon/armor/dice schemas
│   ├── choices.ts      the nested choice primitives + ChoiceDetail
│   ├── class.ts        class template + list item
│   ├── species.ts      species template + list item
│   ├── background.ts   background template + list item
│   ├── character.ts    saved character + the builder form schema
│   ├── payload.ts      the create-character API request shape
│   ├── ui.ts           hand-written UI types (ActiveChoice, OptionItem, …)
│   └── index.ts        barrel — re-exports everything above
├── auth.ts           login/register schemas + inferred types
├── user.ts           user schema + User
└── api.ts            small shared types (OnAuthFailure)
```

**Always import from the domain, never from an internal file:**

```ts
// ✅ do this — the barrel is the public surface
import {
  characterSchema,
  type Character,
  type ActiveChoice,
} from "@/types/character";

// ❌ never reach past the barrel into an internal file
import { characterSchema } from "@/types/character/character";
```

This is what lets the files stay small _and_ keeps imports short: split a domain
into as many small files as readability wants, and the barrel
([src/types/character/index.ts](../src/types/character/index.ts)) hides the split.
A small domain (`auth`, `user`, `api`) is just one file — it's its own barrel.

---

## The rule for every kind of type

| Kind of type                                                                 | Where it goes                                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| A Zod schema for an API / domain / form shape, **plus its `z.infer<>` type** | Together, in `src/types/<domain>`                                           |
| A shared type **not** derived from a schema (e.g. `ActiveChoice`)            | `src/types/<domain>`, next to the schemas it relates to                     |
| A **component prop type** (`ButtonProps`, `ChoiceModalProps`)                | **Inline**, at the top of that component's own file — never in `src/types/` |
| A type used only inside one util/hook                                        | Inline in that file                                                         |

The reasoning: API shapes get a Zod schema because they cross a trust boundary
(the network) and need runtime validation. Prop types never cross a boundary —
they're a compile-time contract between a component and its caller, so they
belong right next to the component, not in a central folder.

---

## How a schema flows through the app

Using the character builder as the worked example:

1. **Define** the API shapes once in `src/types/character/` (e.g.
   [class.ts](../src/types/character/class.ts) holds `classTemplateSchema`).
2. **Validate API responses** with `.parse()` in the fetch layer
   ([src/utils/api/characters.ts](../src/utils/api/characters.ts) does
   `characterSchema.parse(response.data)`), so bad data fails loudly at the edge.
3. **Validate form input** by handing a schema to react-hook-form's resolver
   ([CharacterBuilderForm.tsx](../src/components/character-builder/CharacterBuilderForm.tsx)
   uses `zodResolver(characterBuilderSchema)`).
4. **Type everything downstream** with the inferred types — the hook, the payload
   builder, the components all import `ClassTemplate`, `CharacterBuilderFormValues`,
   etc. from `@/types/character`, never redefining them.

One schema, used at every layer. No duplicate type definitions, no drift.

---

## Adding a new schema (step by step)

Say the backend adds a "Feat" detail endpoint.

1. Pick the domain folder (here, `src/types/character/`). Add a file
   `feat.ts`:

   ```ts
   import { z } from "zod";

   export const featSchema = z.object({
     key: z.string(),
     name: z.string(),
     description: z.string(),
   });

   export type Feat = z.infer<typeof featSchema>;
   ```

2. Re-export it from the barrel
   ([index.ts](../src/types/character/index.ts)): add `export * from "./feat";`.
3. Use it: `import { featSchema, type Feat } from "@/types/character";` — validate
   the response with `featSchema.parse(...)` in the fetch function, and type the
   rest with `Feat`.

That's the whole pattern. If the new thing is a brand-new domain (not character,
auth, or user), make a new top-level file `src/types/<domain>.ts`, or a folder
with a barrel if it'll grow past a comfortable single file.

---

## When NOT to use Zod

- **Component props** — plain `interface FooProps` inline in the component file.
  Props don't need runtime validation; TypeScript already checks them at the call
  site.
- **Internal helper types** in a single util — a local `type` is fine; don't
  export it or move it to `src/types/` unless something else needs it.
