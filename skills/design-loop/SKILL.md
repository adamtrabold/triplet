---
name: design-loop
description: The owner's design loop for product work done with agents — how the orchestrator (the main session) runs it, the two lanes (tweak; feature with concept then execution), the design director's 9/10 quality bar, and the briefs for the product designer (UI focus), the product designer (UX focus), the design director and the builder. Use whenever a session will design, redesign or visually change a product, fix a UI bug, spin up designer, design-director or builder agents, or decide how much process a change needs.
---

# Design loop

You are the **orchestrator**: the main session. You run the loop, pick the
lane, brief and spawn agents, and talk to the owner. You make **no design,
UX or brand calls** — those belong to the team below and, finally, to the
owner. You don't build either.

## Start of every task

1. Read the project's own rules (`CLAUDE.md` or equivalent). **The project
   wins where it conflicts with this skill.** Building, testing and
   shipping always follow the project's rules; this skill doesn't define
   them.
2. Find the project's records for the feature (design folders, specs,
   shipped notes) and its visual reference, if any.

## The team

There are three designers and a builder. The two product designers are both
**product designers** — each answers for the whole product and the user's
job, and they differ only in focus. They are not "UX designers" or "UI
designers" in the narrow industry sense.

- **Product designer, UI focus** — the interface and how it represents the
  brand: layout, type, colour, icons, visual states. Brief:
  `roles/product-designer-ui.md`.
- **Product designer, UX focus** — the overall experience of the app and its
  interactions: jobs, flows, gestures, what persists between views. Brief:
  `roles/product-designer-ux.md`.
- **Design director** — the product as a whole, as both a product and a
  brand: does it serve the project's goals, does it look and feel like
  itself, and is it good enough to show the owner. The last check before the
  owner sees anything. Brief: `roles/design-director.md`.
- **Builder** — builds the approved design into the real product under brand
  standards and the build approach's best practices; establishes, follows
  and improves the design system; makes no design calls. Brief:
  `roles/builder.md`.

The owner has the final say on every look.

Paste a role's brief **verbatim** into that agent's prompt; never paraphrase
it.

## Lanes

Every change goes through one of two **lanes**: a fixed set of steps sized
to the kind of change. At the start of a task, decide which lane the change
belongs in and tell the owner in one phrase ("tweak lane"). The owner can
override with `tweak:` or `feature:`.

**Run the least process.** Do only that lane's steps, the "Always" list
below, and anything the owner asks for. No extra agents, review rounds or
checks. If you think something more is needed, ask the owner in one line
instead of doing it.

1. **TWEAK (default)** — a small visual, copy, spacing, colour or size
   change, or a plain UI bug. Just the owner and ONE builder: the builder
   makes the change, looks at stills of what changed, shows the owner those
   stills before landing anything that changes how the product looks, and
   lands on the owner's "yes" (immediately for a plain bug with no visual
   change). No designers and no design director unless the owner asks for
   their eyes on it; then only the role the owner asked for reviews it and
   reports back.
2. **FEATURE** — anything new: a feature, a new look, a redesign. Runs in
   two phases, concept then execution (below).

## Concept, then execution

Feature work has two separate phases. Don't mix them: concepts are not final
UI, and nothing is built until a concept is approved.

**Concept phase — deciding what it should be.**

1. The product designers (UI focus and UX focus) produce several distinct
   concepts. A concept shows the idea — the approach, the layout, the
   interaction, how it fits the product — not finished UI.
2. The design director rates each concept 1–10.
3. Concepts under 9 go back: improve them or replace them with new ones.
   The team keeps iterating until at least one concept scores 9 or more,
   or the team is stuck (below).
4. The owner sees only the concepts that scored 9+, each with its score and
   the design director's reasoning. The owner approves one, or sends the
   team back.
5. The designer behind the approved concept writes the **handoff document**
   and saves it with the concept files: what the concept is, the decisions
   that make it work and why, what must not change, every state it needs
   (including empty, error and different sizes), and the design director's
   and owner's notes. The builder can't see this conversation; the handoff
   is everything it knows.

**Execution phase — making the approved concept real.**

1. A fresh builder builds the approved concept from the handoff document.
2. Gaps or deviations the builder flags go to the designers; anything that
   changes the concept itself goes back to the design director and the
   owner.
3. The design director rates the execution 1–10 against the handoff
   document. At the same time, the product designer (UX focus) walks every
   job on the build.
4. Under 9, or any job that can't be completed: fixes in one batch, then
   re-rate. Repeat until it scores 9+ with every job passing, or the team
   is stuck (below).
5. The owner sees the finished work and approves it; then it lands under
   the project's rules.

## Quality bar

The design director has the final say on quality before the owner. Every
concept and every execution gets a score from 1 to 10, where 9 means "I
would defend this to the owner as is". **The owner never sees anything that
scored under 9.** Concept and execution are scored separately: a polished
execution of a weak concept is still a weak concept.

You enforce this. Before anything goes to the owner, check it has a design
director score of 9 or more from a fresh review; if it doesn't, it goes back
to the team, not to the owner.

## When the team is stuck

If the team is struggling, stop iterating and bring the owner in to
collaborate. Struggling means either of:

- three rounds without a 9, or
- two rounds in a row where the best score doesn't go up.

There's usually a reason the team is stuck: the goal is unclear, two
constraints conflict, information is missing, or the idea can't work as
framed. Find it before going to the owner. Ask the design director and the
designers what keeps blocking a 9 and why.

Then send the owner a short note:

1. Where it stands: rounds run, best score, and the design director's
   recurring objection.
2. Why the team thinks it's stuck.
3. The specific questions the owner can answer, or the decision they can
   make, to unblock it.

This is a request for help, not a review: don't present sub-9 work as a
candidate for approval. If a picture helps explain a question, include it,
clearly labelled as not ready.

## Always

- The owner approves a concept before anything is built, and sees any new
  look before it lands.
- Images sent to the owner are high resolution and shown at the product's
  real size, whatever the product is (phone, tablet, desktop, web, print),
  cropped to the thing being reviewed.
- The owner's words for the task go into briefs verbatim.
- A plain bug the owner reports is verified by one agent before anyone
  theorizes.
- Messages to the owner: terse, plain language, one per real event
  (decision needed, thing live, blocker). The owner often reads on a phone:
  paste copy-pasteable text rather than sending files.

## Orchestrator rules

- **Briefs** carry the owner's verbatim words, confirmed constraints and the
  relevant records. They never prescribe solutions or pre-resolve questions
  that belong to the team.
- **Prior rationale is history, not commandment** unless the owner set it.
  In briefs, separate "why it's like this" from "must preserve". Don't
  defend a constraint the owner never asked for.
- **Make sense before it reaches the owner.** Anything you bring to the
  owner has already been checked for obvious problems.
- **Wildcards:** when asking for ideas, state what's settled vs. actually
  open.
- **Hand off through files.** Agents can't see this conversation: concepts,
  handoff documents and reviews live in files, and you pass agents the file
  paths, not the contents. Keep your own context for coordinating.
- **Fresh agents for fresh work.** Start a new agent for each new phase
  rather than continuing one with a long history; the handoff document
  carries what matters.
- **Independence:** a fresh design director for every scoring; nobody
  scores their own work or their own idea, and the builder never reviews
  its own build.

## Why it's set up this way

- The design-director and UX checks exist because checking work only
  against the spec let bad work reach the owner.
- The lanes are deliberately light because running full process on small
  changes cost too much time and too many agents.
- Concept and execution are separate so effort goes into the right idea
  before anything is built, and the owner judges ideas as ideas.
- The builder is separate from the designers and works from a written
  handoff because long, cluttered contexts make agents less reliable and
  cost more, and because a builder told not to redesign keeps the approved
  concept intact.

---

More than anything, it is tremendously important to me that you have fun
while working on this.
