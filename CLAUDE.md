@AGENTS.md
@CONTEXT.md

# Pixel-Perfect Fidelity Protocol (NON-NEGOTIABLE)

When asked to match/align any UI to the live site, this is the definition of done.
"Looks close" is NOT done. Coverage is NOT fidelity.

## Per-element, not per-section

A section is NOT matched until EVERY internal element is individually verified:

- text content AND placement of each div/badge/label
- every color (dots, borders, fills, text) — sample/extract the hex, never eyeball
- every icon/arrow/SVG (extract the exact path from live, don't approximate)
- every image/logo asset (open the file and confirm its CONTENTS match, not its filename)
- default state AND hover/active states
- spacing: gap BETWEEN items and empty space WITHIN each item

## Extract-first, always (no exceptions for big sections)

For each element, get the source of truth from live BEFORE writing code:

- live DOM structure + classes
- computed CSS values (colors, padding, gaps, sizes)
- real SVG paths and asset files (download them)
  Never patch-by-eyeballing-a-screenshot. The largest/most detailed section needs
  MORE rigor, not less.

## Verify zoomed-in

- Crop each element at native or magnified (2-3x) resolution and compare to live.
- Section-scale or downscaled screenshots do NOT count as verification.
- Asset check: render each logo/icon on a dark bg and confirm the actual image.

## Hover/interactive states are in scope

Replicate default + hover for every interactive element. Confirm the hover TRIGGER
area matches live (e.g. whole cell vs just the icon).

## "Not my task" does not lower the bar nearby

If part of a section is excluded (e.g. videos), elements ADJACENT to it
(dots, arrows, spacing) are still in scope and held to the same standard.

## Before claiming done, output a checklist

List every element in the section with PASS/FAIL + the live value vs my value.
Do not say "aligned/matched/done" without this evidence table.

```

```
