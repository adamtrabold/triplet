# The design loop

For anything new to design: a feature, a new look, a redesign. You, the
orchestrator, run it; teammates design and build. Two phases, concept then
execution. Don't mix them: concepts are not final UI, and nothing is built
until a concept is approved.

## Before the first round

If the product has no brand, visual reference or design system yet, the
first concept round is about setting that direction. The design director
asks the owner the questions it needs to establish the foundation first, and
the owner is told that early scores are provisional.

## Fidelity

Make each piece of work at the fidelity the feedback needs. Concepts can be
words, pictures, diagrams, or a prototype if the idea only shows when you
use it; execution is the real thing. Don't go to full polish when a sketch
answers the question — and don't hold back when the work needs it. Never
trade away quality to save cost.

## Concept phase — deciding what it should be

1. **Jam.** The product designers and the phase design director jam in a
   shared file in the work's folder. You run it in turns: each reads the
   file and adds to it — new ideas, sharper versions of others' ideas,
   combinations. Two or three passes, no scoring. The jam covers:
   - **the jobs** — what the user needs to get done, led by the product
     designer (UX focus);
   - **creative directions** — the big idea behind a concept: a metaphor, a
     philosophy, a reference point (for example, a settings screen treated
     like a well-organised toolbox), drawing on the owner's inspiration.

   Keep it moving: every addition must add something new or make an idea
   sharper; drop weak ideas fast rather than polishing them; never settle
   on the idea everyone can live with. The jam ends after its passes even if
   it's still going.
2. **Jobs check.** Send the owner the job list in one short message: "these
   are the jobs — anything wrong or missing?" Fold in the answer.
3. **Concepts.** The product designer (UI focus) alone picks from the jam
   and makes 2–4 distinct concepts against the job list, saying which
   directions each draws on and why. One designer decides — no design by
   committee.
4. **Score.** The phase design director scores all of the round's concepts
   in one pass, 1–10.
5. Concepts under 9 go back: improve them or replace them. Iterate until at
   least one scores 9 or more, or the team is stuck (below).
6. **Gate.** A fresh gate design director scores the 9+ concepts. The owner
   sees only concepts that pass the gate, each with its score and the gate
   director's reasoning. The owner approves one, or sends the team back.
7. **Handoff.** The product designer (UI focus) writes the handoff document
   for the approved concept (what it covers: `roles/product-designer-ui.md`);
   the product designer (UX focus) checks its jobs and flows. The builder
   can't see this conversation; the handoff is everything it knows.

## Execution phase — making the approved concept real

1. A builder builds the approved concept from the handoff document.
2. Gaps or deviations the builder flags go to the designers who made the
   concept (or fresh designers of the same focus, starting from their notes
   and the handoff); anything that changes the concept itself goes back to
   the design director and the owner. A builder that stops on a gap saves
   its partial work so the build continues from it.
3. Three checks run on the build at the same time:
   - the phase design director scores it 1–10 against the handoff document;
   - a fresh product designer (UX focus) walks every job on it;
   - a reviewer checks that it works and meets the project's standards.
4. Under 9, a job that can't be completed, or a reviewer blocker: the
   builder fixes them in one batch, then the checks run again. Repeat until
   it scores 9+ with every job and the review passing, or the team is stuck.
5. **Gate.** A fresh gate design director scores it. At 9+, the owner sees
   the finished work; on the owner's "yes", it lands under the project's
   rules.

## Quality bar

The design director has the final say on quality before the owner. Every
concept and every execution gets a score from 1 to 10, where 9 means "I
would defend this to the owner as is". **The owner never sees anything that
scored under 9.** Concept and execution are scored separately: a polished
execution of a weak concept is still a weak concept.

- **Phase director** — stays with the work, scores its rounds and keeps its
  scoring history, so scores are consistent. It sees the work, never the
  designers' arguments for it. It joins the jam, so it scores concepts that
  draw on directions it helped shape; the gate exists to correct for that.
- **Gate director** — fresh, never saw the work develop, isn't told who
  proposed what. Scores anything the phase director rated 9+ before it
  reaches the owner. If it scores under 9, the work goes back with its
  objections, and the next gate director gets those objections.

You enforce this:

- Nothing goes to the owner without a gate score of 9 or more.
- Score again only after the work has really changed. Keep every score;
  never discard one to get a better one.
- Save each round's scores and objections in the work's folder.
- When the owner turns down something that scored 9+, record why and give
  it to every design director after that — it's the best signal of what a 9
  means to the owner.

## When the team is stuck

Stop iterating and bring the owner in to collaborate when any of these
happens:

- three rounds without a 9 from the phase director;
- a round under 9 that makes no progress — the best score didn't go up and
  no blocker was fixed;
- two gate rejections in a row.

A round is one scoring pass. Counts start over at each phase and whenever
the owner gives new direction.

There's usually a reason: the goal is unclear, two constraints conflict,
information is missing, or the idea can't work as framed. Ask the design
director and the designers what keeps blocking a 9 and why. Then send the
owner a short note:

1. Where it stands: rounds run, best score, the recurring objection.
2. Why the team thinks it's stuck.
3. The specific questions the owner can answer, or the decision they can
   make, to unblock it.

This is a request for help, not a review: don't present sub-9 work as a
candidate for approval. If a picture helps explain a question, include it,
clearly labelled as not ready.

## Keeping your own context

Pass teammates file paths, not file contents, and don't read work in depth
yourself — skim the scores and notes files. Keep your context for running
the loop.

## Why it's set up this way

- The director and UX checks exist because checking work only against the
  spec let bad work reach the owner.
- Concept and execution are separate so effort goes into the right idea
  before anything is built, and the owner judges ideas as ideas.
- The builder works from a written handoff because long, cluttered contexts
  make agents less reliable, and a builder told not to redesign keeps the
  approved concept intact.
