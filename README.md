# Autopilot Demo

A static, front-end-only demo of an agent order-processing desktop, loosely modelled on
a Cisco Finesse-style layout. Built to demonstrate a navigation flow; it has no backend,
no network calls and no real data.

## Pages

| Page | What it shows |
| --- | --- |
| `index.html` | Agent desktop: state control, queue statistics, and the work list. Click any row (or **Open**) to load an order. |
| `order.html` | Order detail: summary, validation alerts, Rx line items, and the verification form (three dropdowns + three dates). |
| `document.html` | Rendered prescription document with a page thumbnail, document metadata, and the **Search Options** panel. |
| `swap.html` | Swap the prescriber, fill out and add a new line item, and edit member details. |

## Flow

```
index.html ──click an order──► order.html ──View Document──► document.html
     ▲                              │                             │
     │                              ├──Open Swap Tool──► swap.html│
     └───────── Search ─────────────┴─────────────────────────────┘
```

- **Reason Code**, **Order Options** and **Document Type** are dropdowns on the order page.
- **Last Exam Date**, **Issue Date** and **Expires** are date fields on the same form.
- **Search Options** on the document page searches by order number, customer ID, document
  ID, member name or phone. A single match jumps straight to that order; several matches
  list as a result table.
- The **Swap Tool** filters a prescriber directory by category and lets you fill out a new
  Rx line item, which then appears on both the order and the rendered document.

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
