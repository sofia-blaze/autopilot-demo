# Autopilot Demo

A static, front-end-only demo of an agent order-processing desktop, loosely modelled on
a Cisco Finesse-style layout. Built to demonstrate a navigation flow; it has no backend,
no network calls and no real data.

## Pages

| Page | What it shows |
| --- | --- |
| `index.html` | Agent desktop: state control, queue statistics, and the work list. Click any row (or **Open**) to load an order. |
| `order.html` | Order detail: summary, validation alerts, Rx line items, and the verification form (three dropdowns + three dates). |
| `document.html` | The prescription as selectable content, document metadata, and the **Search Options** panel. |
| `docview.html` | The same document in a bare window, sized to sit on a second screen. Opened via **Open Document In Second Window**. |
| `swap.html` | Swap the prescriber, fill out and add a new line item, and edit member details. |

## Flow

```
index.html ──click an order──► order.html ──View Document──► document.html
     ▲                              │                             │
     │                              ├──Open Swap Tool──► swap.html│
     └───────── Search ─────────────┴─────────────────────────────┘
```

- **Reason Code**, **Order Options** and **Document Type** are dropdowns on the order page.
- **Last Exam Date**, **Issue Date** and **Expires** are free-text fields on the same form.
  Type them however you like — `09/30/2026`, `9-30-26` and `2026-09-30` are all accepted
  and normalised to `MM/DD/YYYY` on save. Invalid dates (`02/31/2026`) are rejected.
- **Search Options** on the document page searches by order number, customer ID, document
  ID, member name or phone. A single match jumps straight to that order; several matches
  list as a result table.
- The **Swap Tool** filters a prescriber directory by category and lets you fill out a new
  Rx line item, which then appears on both the order and the rendered document.

## The five-stage verification

Every order carries a progress tracker, shown at the top of the Order, Document and Swap
screens. An order cannot be submitted until all five stages are clear:

| # | Stage | Screen |
| --- | --- | --- |
| 1 | Enter prescription dates | Order |
| 2 | Select reason code and order options | Order |
| 3 | Review the linked document | Document |
| 4 | Assign a prescriber | Swap Tool |
| 5 | Add at least one Rx line item | Swap Tool |

The queue holds two orders. **0192884512 (June Nakamura)** is already populated and opens
at 3/5 — it only needs the document review and the two dropdowns. **0192885017 (Rowan
Alcaraz)** starts at 0/5 with blank dates, no prescriber and no line items, so the whole
flow can be walked end to end.

## The document is the source of truth

Nothing has to be invented. Each order's scanned prescription carries the dates, the
prescriber and the prescribed lines, and the demo pushes those values into the order
rather than asking you to guess:

- The document screen opens with a **Transcribe From This Document** panel listing what
  goes where.
- The order screen shows what the document reads and offers **Copy Dates From Document**.
- The swap screen lists the prescribed lines under **As Written On The Document**, each
  with a **Use This** button that loads it into the item form. The form pre-loads the
  first line the order is still missing, and advances to the next one after each add.
  Lines already on the order are marked *On order*. **Add All Items From Document** in
  the bottom bar adds every missing line at once.
- The prescriber panel names the prescriber written on the document, so you know who to
  search for.

`Update Files` saves a draft and validates only what has been typed. Completeness is
enforced at `Review & Submit`, which lists any outstanding stages, then shows a Final
Review summary drawn from all three screens before `Confirm & Submit` issues a
confirmation number and locks the order read-only. `Reopen Order` unlocks it again.

## Second screen

The document is ordinary selectable HTML, not a page image. **Open Document In Second
Window** pops it out into its own bare window to drag onto another monitor; every value
can be highlighted, and each has a **Copy** button (plus **Copy all lines** for the Rx
table). If the browser blocks the pop-up, **Open In New Tab** does the same thing in a
tab. The window stays put while you work the order.

## Keyboard

The swap screen is built to be driven by Tab:

1. Tab once — a **Skip to actions** link appears; press Enter.
2. Focus lands on **Add All Items From Document**. Press Enter to add every prescribed
   line.
3. Tab once more for **Back to Order**, the last stop on the page.

The action bar is sticky at the bottom and is always last in the DOM, so tabbing down
through the whole page reaches the same two buttons in the same order. Focus rings are
deliberately high-contrast.

Edits are held in `sessionStorage`, so they survive navigation between pages but are
cleared when the tab closes. Nothing is sent anywhere.

## Running it

Any static file server works:

```bash
python3 -m http.server 8127
```

Then open <http://localhost:8127>. Opening `index.html` from the filesystem also works.

## About the data

Every value in [`assets/js/data.js`](assets/js/data.js) is **fictional** — invented names,
`example.com` addresses, `555` phone numbers, made-up order and person IDs, fictional
prescribers and fictional lens brands. The rendered prescription is a mock-up, not a
medical record.

This repository is public. Do not replace the sample data with real customer, patient or
prescription information, and do not commit screenshots of production systems.
