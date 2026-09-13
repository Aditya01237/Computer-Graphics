# CSE606 Furniture Layout Planner

A complete vanilla JavaScript and WebGL implementation for Programming Assignment 1.

## What is included

- A responsive WebGL canvas with stable high-DPI resizing.
- Randomized room proportions with separately labelled living and dining areas, a kitchen, a bedroom, and an optional bathroom. Living and dining remain open to one another; other rooms have walls and pre-rendered doorways.
- All six required shapes/design elements: bed, sofa, dining set, coffee table, L-shaped sectional, and doorway.
- Compound furniture geometry rendered from rectangles, circles, line segments, and quarter-circle arcs.
- Per-instance translation, z-axis rotation, and uniform scale through 3×3 model matrices.
- Math-based object picking that transforms the pointer from global/world coordinates into each object's local coordinate system.
- Three interface modes: Plan, Save, and Retrieve. Press `M` to cycle through them.
- Named plans stored in browser `localStorage`, including the exact generated room layout, labels, and every object transform. Earlier version saves remain readable.

## Run locally

The site has no dependencies or build step. Serve the `dist` folder with any static server. For example:

```bash
python3 -m http.server 4173 --directory dist
```

Then visit `http://localhost:4173`.

Opening `dist/index.html` directly may also work, but using a local server is more reliable across browsers.

## Controls

| Input | Result |
| --- | --- |
| Furniture button | Spawn a new instance at the center |
| Click | Select a furniture instance |
| Drag | Translate the selected instance |
| Mouse wheel | Rotate the selected instance by 5° |
| Shift + mouse wheel | Scale the selected instance |
| Left/right arrow | Rotate by 15° |
| Up/down arrow | Scale up/down |
| Smaller / Larger buttons | Scale down/up |
| `G` | Randomize the room layout |
| `M` | Cycle Plan → Save → Retrieve |
| Delete/Backspace | Remove the selected instance |
| Escape | Leave a text field; otherwise clear selection |

Keyboard shortcuts do not run while typing in a text field or using the saved-plan selector. Press Escape to return focus to the canvas. Save and Retrieve modes pause furniture editing and layout randomization.

The initial arrangement contains all five furniture types. Randomizing rooms preserves furniture coordinates, so rearrange any pieces that overlap a changed wall. Collision detection is not implemented. Each save adds a separate entry, even if the name is reused; saves are local to this browser and address.

## Submission checklist

- Replace the sample team-member names and student IDs in `REPORT_DRAFT.md`, then adjust the sample contribution and AI-use statements to match each member's actual work.
- Complete one AI declaration form per team member, accurately describing the assistance used.
- Record the workflow using `VIDEO_SCRIPT.md` as a guide.
- Test the submitted folder in a fresh browser before packaging it.
- Submit the `dist` folder as the runnable application source, along with the report and video required by the course.

## File map

- `dist/index.html`: interface and control markup.
- `dist/styles.css`: responsive visual design.
- `dist/app.js`: WebGL renderer, geometry, transforms, picking, modes, and persistence.
- `REPORT_DRAFT.md`: report text aligned with the assignment questions.
- `VIDEO_SCRIPT.md`: concise demonstration plan.
