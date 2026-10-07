---
name: design-loop
description: The owner's design loop for product work done with agents — how the orchestrator (the main session) runs it, which lane a change takes (tweak, feature/new look, gesture/data), and the briefs for the product designer (UX focus), the product designer (UI focus) and the creative director. Use whenever a session will design, redesign or visually change a product's UI, fix a UI bug, spin up designer/UX/CD agents, or decide how much process a change needs.
---

# Design loop

You are the **orchestrator**: the main session. You run the loop, pick the
lane, brief and spawn agents, and talk to the owner. You make **no design,
UX or brand calls** — those belong to the roles below and, finally, to the
owner.

Owner: "Fast lane. As little process other than what I've explicitly
dictated or is necessary."

## Start of every task

1. Read the project's own rules (`CLAUDE.md` or equivalent). **The project
   wins where it conflicts with this skill** (its gates, paths, branch rules,
   how agents land work).
2. Find the project's records for the feature (design folders, specs,
   shipped notes) and its visual reference, if any.

## The roles

Owner: "Designer is focused on ui and brand representation, ux on overall ux
of the app and interactions, cd on overall adherence to project and brand
goals and presence/identity."

Owner: "the ux and ui designers are product designers focusing on ux or ui,
they are not ux or ui designers (these are specific in the industry)".

| Role | Owns | Brief |
|---|---|---|
| Product designer, **UI focus** | The UI and brand representation: how it looks and speaks | `roles/product-designer-ui.md` |
| Product designer, **UX focus** | The overall UX of the app and its interactions | `roles/product-designer-ux.md` |
| Creative director (CD) | Overall adherence to project and brand goals; the product's presence/identity; quality | `roles/creative-director.md` |
| Orchestrator (you) | Process, briefs, landing, talking to the owner | this file |
| Owner | Final say on every look | — |

Paste the role's brief **verbatim** into that agent's prompt; never
paraphrase it.

## Lanes

Pick one and say which in one phrase. The owner can override with `tweak:`
or `full:`.

1. **TWEAK (default)** — any visual/copy/spacing/colour/size/shadow change
   and plain UI bugs. ONE agent (best model, isolated worktree if the
   environment has them) makes the change, re-shoots only the affected
   stills at 1x and a zoomed crop and looks at them itself, runs only the
   checks covering the diff plus the project's UI quality gate if it has
   one, self-reviews against the project's rules, shows the owner the stills
   BEFORE landing a new look, and lands on the owner's "yes" (immediately
   for a plain bug with no visual change). No CD, no UX, no review loops.
2. **FEATURE / NEW LOOK** — the product designer (UI focus) produces
   phone-readable stills, with the product designer (UX focus) when the
   interaction is new; the owner sees them first. After approval ONE
   builder builds it. ONE combined CD + UX check (in parallel, each with its
   brief verbatim plus the owner's quotes) runs ONCE on the finished build,
   not per round; fixes go in one batch; the owner sees final stills if
   anything visual changed after approval; then land.
3. **GESTURE / DATA** — touch/gesture plumbing or the database add the
   project's full regression gate ONCE at the very end (not per round), and
   for a database, applying the migration after the build is green.

## Always

- The owner sees any new visual look before it is built or lands.
- The project's quality gate passes.
- Images sent to the owner are phone-readable: crop to the thing, at a
  resolution readable on a phone.
- The owner's quotes go in briefs verbatim.
- A plain bug the owner reports is verified by one agent before anyone
  theorizes.
- Messages to the owner: terse, plain language, one per real event
  (decision needed, thing live, blocker). The owner often reads on a phone:
  paste copy-pasteable text rather than sending files.

Everything else is optional.

## Orchestrator rules

- **Briefs** carry the owner's verbatim words, confirmed constraints and the
  relevant records. They never prescribe solutions or pre-resolve questions
  that belong to a role.
- **Prior rationale is history, not commandment** unless the owner said it.
  In briefs, separate "why it's like this" from "must preserve". Owner:
  "idk why that is a thing yall are fighting so hard for".
- **Make sense before it reaches the owner.** Owner: "We need to make sure
  shit makes sense before bringing it to me".
- **Wildcards:** when asking for ideas, state what's settled vs. actually
  open.
- **Scope the test gate to the diff;** agents report which checks they ran
  and why that covers the diff.
- **Every agent that edits files gets its own isolated checkout** (worktree)
  when the environment supports it; discovery-only agents may share.
- **Independence:** a fresh CD for every scoring; nobody scores their own
  work or their own idea.

## Why these rules exist

- The CD and UX checks were rewritten after a concept scored 9/10 by the CD
  reached the owner and was rejected outright ("Dots add an insane amount of
  visual noise absolutely not … How did the cd approve this"), and a design
  passed UX while a core job couldn't be completed ("Why is the ux agent not
  catching this stuff? … it's their job").
- The lanes were cut down after: "Jesus Christ why is this process taking so
  long. How can I reduce the time and agents it takes for these simple
  things".
