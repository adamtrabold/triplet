# Impeccable gate

One command, run identically by every agent, for every part of
[Impeccable](https://github.com/pbakaus/impeccable) that can run here.
Pinned to `impeccable@4.1.0` (engine 0.1.5) and the matching skill, vendored at
`.agents/skills/impeccable/` (tag `cli-v4.1.0`, Apache-2.0, see its `VENDOR.txt`).

```sh
design/impeccable-gate/run.sh [path/to/index.html]           # --gate (default): deterministic, must pass
design/impeccable-gate/run.sh --review [path/to/index.html]  # gate + review packet for the LLM critics
design/impeccable-gate/run.sh --check-review <packet-dir>    # is the filled review mergeable?
design/impeccable-gate/run.sh --update [path/to/index.html]  # rewrite baselines: owner/operator approval only
```

**Any UI change runs both `--gate` and `--review` (then `--check-review`).**
Exit codes: 0 pass, 1 failed/blocked, 3 could not run. Exit 3 is never a pass:
it means the npm package could not be fetched (offline with a cold npm cache),
no Chromium was found, or a UI state could not be reached.

## What runs, and what blocks merge

| Impeccable part | Runs here? | How | Blocks merge |
|---|---|---|---|
| `detect`, file mode (static HTML/CSS) | yes | `--gate`; `npx -y --offline impeccable@4.1.0 detect --json --no-config --no-inline-ignores --no-design-system`, registry fetch if not cached | any identity added or missing vs `baseline.json` |
| `detect`, URL mode (rendered DOM) | yes | `--gate`; app served on loopback with the gesture-harness stub, 390x844, one scan per state: list, popup, sort, add, plans (n/a on builds without it) | any identity added or missing vs `runtime-baseline.json` |
| skill `context` (deterministic) | yes | `--review`; vendored launcher with the npm engine via `IMPECCABLE_BIN` | no (its output goes in the packet) |
| critic commands: critique, audit, polish, distill, harden, onboard, quieter, bolder, typeset, layout, colorize, animate, delight, overdrive, clarify, adapt, optimize | yes, by agents | `--review` writes `reviews/<date>-<sha>/BRIEF.md` + `REPORT.md`; agents follow `reference/<command>.md` read-only | `--check-review`: any section not done, a stale sha, or a P0/P1 without a designer/UX/CD disposition |
| `init`, `document`, `extract` | not per change | write PRODUCT.md / DESIGN.md / tokens: one-time owner decisions (backlog) | no |
| `shape`, `craft` | not per change | build flows: the designer's tools in the concept stage | no |
| `live` | no | interactive in-browser variant mode; needs a human at a browser and the live server | no |
| `help`, `install`, `update`, `check` | no | need impeccable.style, blocked by the egress proxy; `install` is replaced by the vendored skill | no |
| design hook (detector after each edit) | not installed | would be `.claude/settings*.json` config: an owner decision; the gate runs the same detector | no |
| `pin`, `hooks`, `doctor`, `ignores` | not used | housekeeping; waivers live in the baselines, not in `.impeccable/config.json` | no |

## Identities (why not just "3 findings")

`detect --json` gives `line: 0` and generic snippets, so a count can stay the same
while one finding is fixed and another introduced. Each finding gets an identity:

- **Static, `clipped-overflow-container`**: the snippet is only `<tag> clips a
  positioned child`. The gate attributes each one by probing: every CSS rule (and
  inline style) with `overflow: hidden|clip` is set to `visible` in a scratch copy,
  one at a time, and the finding that disappears gets that rule's selector
  (`clipped-overflow-container @ #mainContent`). All copies go through one detector
  call (~4s total).
- **Static, every other rule**: `rule | snippet` (the snippet already names the
  thing: a colour, a text sample), `#n` for exact repeats.
- **Runtime**: `rule | snippet` as a set across states (every list row repeats the
  same few findings, so a new row with a known pattern is not new; a new pattern in
  any state is). `all-caps-body`'s per-row character count is dropped. The states an
  identity shows in are recorded as information.

The diff fails on any added or missing identity, both layers. Missing means "fixed,
or no longer rendered": the baseline is then updated deliberately, so a later
regression to the same identity is caught again.

## What each layer can and can't see

- **Static** sees `index.html`'s own markup and `<style>`. It can't see anything
  JavaScript renders: list rows, popups, the sort menu, the add form's dynamic
  parts, map markers. It ignores `.impeccable/config.json`, `DESIGN.md` and inline
  `impeccable-disable` comments on purpose (a waiver comment would otherwise make
  findings vanish silently; waivers live in the baselines with a reason).
- **Runtime** sees the rendered DOM and computed styles in Chromium at 390x844, with
  the stub fixture (`design/gesture-harness/stub.js`, the build's own copy when it
  has one; Reykjavik, signed in), in five states driven by `driver.js`. It can't see
  states it isn't driven to (swipe gestures mid-flight, delete confirm, the city
  picker, shape popups, empty/error states), animation in motion, real map tiles,
  live Supabase/OSM data, or Safari. Mutation-tested: a 9px sort-menu label (JS-only)
  fails runtime while static stays green.
- **Neither** judges design: the critic commands and the designer/UX/CD loop do.

## Hermetic and offline

Telemetry off (`IMPECCABLE_NO_TELEMETRY=1`, `DO_NOT_TRACK=1`); `IMPECCABLE_BIN` is
cleared for the detector so the shim always runs 4.1.0's engine. The npm cache is
tried first (`--offline`), the registry only if the package isn't cached; with
neither the gate exits 3 with a message. The runtime layer serves everything from
loopback (stub, vendored Leaflet and Archivo) and gives Chromium a dead proxy, so
map tiles fail fast and nothing leaves the machine. Runtime adds ~25s (4-5 scans).

## Baselines

`baseline.json` (static) and `runtime-baseline.json` each list accepted identities
with a one-line reason. Only `--update` writes them, and only with owner/operator
approval: it keeps existing reasons and marks new identities `TODO` for a reason.
A build that adds a UI state (plans) shows a note when its n/a states differ.

## Review packets

`--review` runs the gate, runs the skill's `context`, screenshots each state at
390x844 @3x into `shots/` (gitignored), and writes `BRIEF.md` (instructions for the
critic agents: read the vendored SKILL.md and the command's reference, read-only,
CLAUDE.md + `design/inspo/project/` as product context in place of PRODUCT.md,
P0-P3 severities) and a `REPORT.md` skeleton keyed to the file's sha256. Commit the
packet (minus shots) with the change it reviews.
