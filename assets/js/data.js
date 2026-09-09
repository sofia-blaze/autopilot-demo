/* ------------------------------------------------------------------
   Autopilot Demo - sample data
   Everything in this file is FICTIONAL. Names, addresses, emails,
   phone numbers, order numbers, doctors and product names are all
   invented for demonstration purposes only. Do not replace these
   with real customer or patient data - this repository is public.
   ------------------------------------------------------------------ */

const REASON_CODES = [
  "Doctor Verified - Phone",
  "Doctor Verified - Fax",
  "Patient Supplied Rx",
  "Rx On File - Current",
  "Expired - Contact Prescriber",
  "Parameter Mismatch",
  "Duplicate Document",
  "Unable To Verify"
];

const ORDER_OPTIONS = [
  "Submit & Verify",
  "Submit & Skip Verification",
  "Hold For Prescriber",
  "Route To Review Queue",
  "Cancel Order"
];

const FAX_TYPES = ["Customer", "Prescriber Office", "Insurance", "Internal Transfer", "Unclassified"];

const SEARCH_FIELDS = ["Order Number", "Customer ID", "Document ID", "Member Name", "Phone Number"];

const LENS_CATALOG = [
  "CLARIVUE HYDRA+ 12pk",
  "CLARIVUE HYDRA+ TORIC 6pk",
  "OPTISOFT DAILIES 30pk",
  "OPTISOFT DAILIES 90pk",
  "AQUALENS BREATHE 6pk",
  "AQUALENS MULTIFOCAL 6pk",
  "NORTHLIGHT AIR 24pk"
];

const ORDERS = [
  {
    id: "0192883471",
    docId: "100884219",
    customerId: "38771204",
    status: "Waiting For Review",
    statusKind: "warn",
    priority: "High",
    faxType: "Customer",
    received: "2026-09-09 08:14",
    ageMin: 42,
    releaseTime: "",
    takenDate: "2026-09-08 14:22",
    takenBy: "R.QUINTANA",
    rmaOrder: "",
    appliedRule: "1 Year Rule",
    callerId: "5550142889",
    customer: {
      name: "Marisol Vega",
      phone: "(555) 014-2889",
      email: "marisol.vega@example.com",
      street: "412 Larkspur Way",
      city: "Boulder", state: "CO", zip: "80302-4471"
    },
    member: { first: "Marisol", last: "Vega", dob: "1988-03-14", personId: "204118873", verify: "83816447" },
    prescriber: { name: "Dr. Alena Brightwater, OD", clinic: "Larkspur Vision Center", phone: "(555) 014-7702", npi: "1000000017" },
    lastExam: "2025-08-30", expires: "2026-08-30", issueDate: "2025-09-02",
    alerts: [
      "Missing prescriber signature. Please update prescriber information.",
      "ContactDoctorForParameters = true"
    ],
    items: [
      { eye: "OD", item: "CLARIVUE HYDRA+ 12pk", qty: 2, power: "-4.75", bc: "8.40", dia: "14.0", cyl: "0.00", axis: "0", add: "", color: "", flagged: false },
      { eye: "OS", item: "CLARIVUE HYDRA+ 12pk", qty: 2, power: "-5.00", bc: "8.40", dia: "14.0", cyl: "0.00", axis: "0", add: "", color: "", flagged: false }
    ]
  },
  {
    id: "0192884006",
    docId: "100884377",
    customerId: "41220955",
    status: "Waiting For Prescriber",
    statusKind: "err",
    priority: "High",
    faxType: "Prescriber Office",
    received: "2026-09-09 08:31",
    ageMin: 25,
    releaseTime: "",
    takenDate: "2026-09-08 16:47",
    takenBy: "T.ADEYEMI",
    rmaOrder: "",
    appliedRule: "2 Year Rule",
    callerId: "5550193310",
    customer: {
      name: "Desmond Okafor",
      phone: "(555) 019-3310",
      email: "d.okafor@example.com",
      street: "88 Halyard Street, Apt 6C",
      city: "Portland", state: "ME", zip: "04101-2280"
    },
    member: { first: "Desmond", last: "Okafor", dob: "1979-11-02", personId: "204119940", verify: "83816502" },
    prescriber: { name: "Dr. Nils Hammersmith, OD", clinic: "Harborview Eyecare", phone: "(555) 019-4418", npi: "1000000024" },
    lastExam: "2024-10-11", expires: "2026-10-11", issueDate: "2024-10-14",
    alerts: [
      "Parameter mismatch on OS. Axis outside prescribed tolerance.",
      "Submit & Skip Order. Please update parameter information."
    ],
    items: [
      { eye: "OD", item: "AQUALENS BREATHE 6pk", qty: 1, power: "-2.25", bc: "8.60", dia: "14.5", cyl: "-1.25", axis: "180", add: "", color: "", flagged: false },
      { eye: "OS", item: "AQUALENS BREATHE 6pk", qty: 1, power: "-2.50", bc: "8.60", dia: "14.5", cyl: "-1.75", axis: "090", add: "", color: "", flagged: true }
    ]
  },
  {
    id: "0192884118",
    docId: "100884401",
    customerId: "39004871",
    status: "Verified",
    statusKind: "ok",
    priority: "Normal",
    faxType: "Customer",
    received: "2026-09-09 08:52",
    ageMin: 12,
    releaseTime: "2026-09-09 09:05",
    takenDate: "2026-09-09 07:58",
    takenBy: "J.NAKAMURA",
    rmaOrder: "",
    appliedRule: "1 Year Rule",
    callerId: "5550166204",
    customer: {
      name: "Priya Raman",
      phone: "(555) 016-6204",
      email: "priya.raman@example.com",
      street: "1750 Cottonwood Loop",
      city: "Tempe", state: "AZ", zip: "85281-9017"
    },
    member: { first: "Priya", last: "Raman", dob: "1994-06-27", personId: "204120114", verify: "83816588" },
    prescriber: { name: "Dr. Corinne Vasquez, OD", clinic: "Desert Ridge Optometry", phone: "(555) 016-8890", npi: "1000000031" },
    lastExam: "2026-02-19", expires: "2027-02-19", issueDate: "2026-02-21",
    alerts: [],
    items: [
      { eye: "OU", item: "OPTISOFT DAILIES 90pk", qty: 1, power: "-1.50", bc: "8.50", dia: "14.1", cyl: "0.00", axis: "0", add: "", color: "", flagged: false }
    ]
  },
  {
    id: "0192884290",
    docId: "100884455",
    customerId: "40551763",
    status: "Waiting For Review",
    statusKind: "warn",
    priority: "Normal",
    faxType: "Unclassified",
    received: "2026-09-09 09:03",
    ageMin: 8,
    releaseTime: "",
    takenDate: "2026-09-09 08:40",
    takenBy: "A.WHITFIELD",
    rmaOrder: "RMA-88214",
    appliedRule: "1 Year Rule",
    callerId: "0",
    customer: {
      name: "Elias Thorne",
      phone: "(555) 017-4460",
      email: "elias.thorne@example.com",
      street: "9 Kestrel Hollow Road",
      city: "Asheville", state: "NC", zip: "28801-3312"
    },
    member: { first: "Elias", last: "Thorne", dob: "1966-01-19", personId: "204120287", verify: "83816633" },
    prescriber: { name: "Dr. Priyanka Ostrowski, OD", clinic: "Blue Ridge Family Eyecare", phone: "(555) 017-9925", npi: "1000000048" },
    lastExam: "2025-05-06", expires: "2026-05-06", issueDate: "2025-05-08",
    alerts: [
      "Prescription expired on 2026-05-06. Expiration override required.",
      "Invalid caller ID, pre-search not performed."
    ],
    items: [
      { eye: "OD", item: "AQUALENS MULTIFOCAL 6pk", qty: 2, power: "+1.75", bc: "8.40", dia: "14.2", cyl: "0.00", axis: "0", add: "+2.00", color: "", flagged: true },
      { eye: "OS", item: "AQUALENS MULTIFOCAL 6pk", qty: 2, power: "+2.00", bc: "8.40", dia: "14.2", cyl: "0.00", axis: "0", add: "+2.00", color: "", flagged: true }
    ]
  },
  {
    id: "0192884512",
    docId: "100884509",
    customerId: "37882140",
    status: "In Progress",
    statusKind: "info",
    priority: "Low",
    faxType: "Insurance",
    received: "2026-09-09 09:11",
    ageMin: 3,
    releaseTime: "",
    takenDate: "2026-09-09 09:02",
    takenBy: "S.OYELARAN",
    rmaOrder: "",
    appliedRule: "2 Year Rule",
    callerId: "5550188117",
    customer: {
      name: "June Nakamura",
      phone: "(555) 018-8117",
      email: "june.nakamura@example.com",
      street: "6023 Alder Bluff Terrace",
      city: "Olympia", state: "WA", zip: "98501-6640"
    },
    member: { first: "June", last: "Nakamura", dob: "2001-09-30", personId: "204120455", verify: "83816710" },
    prescriber: { name: "Dr. Marcus Feldbrook, OD", clinic: "Cascade Sight Partners", phone: "(555) 018-2204", npi: "1000000055" },
    lastExam: "2026-01-08", expires: "2028-01-08", issueDate: "2026-01-10",
    alerts: [],
    items: [
      { eye: "OD", item: "NORTHLIGHT AIR 24pk", qty: 1, power: "-3.25", bc: "8.70", dia: "14.2", cyl: "0.00", axis: "0", add: "", color: "", flagged: false },
      { eye: "OS", item: "NORTHLIGHT AIR 24pk", qty: 1, power: "-3.00", bc: "8.70", dia: "14.2", cyl: "0.00", axis: "0", add: "", color: "", flagged: false }
    ]
  },
  {
    id: "0192884733",
    docId: "100884588",
    customerId: "42019338",
    status: "On Hold",
    statusKind: "grey",
    priority: "Normal",
    faxType: "Customer",
    received: "2026-09-09 09:16",
    ageMin: 1,
    releaseTime: "",
    takenDate: "2026-09-09 09:12",
    takenBy: "R.QUINTANA",
    rmaOrder: "",
    appliedRule: "1 Year Rule",
    callerId: "5550120076",
    customer: {
      name: "Tobias Lindqvist",
      phone: "(555) 012-0076",
      email: "t.lindqvist@example.com",
      street: "334 Quarry Bend",
      city: "Madison", state: "WI", zip: "53703-1188"
    },
    member: { first: "Tobias", last: "Lindqvist", dob: "1983-07-21", personId: "204120612", verify: "83816844" },
    prescriber: { name: "Dr. Hala Zaman, OD", clinic: "Lakeside Optical Group", phone: "(555) 012-6631", npi: "1000000062" },
    lastExam: "2025-12-02", expires: "2026-12-02", issueDate: "2025-12-04",
    alerts: ["Customer requested callback before shipment."],
    items: [
      { eye: "OU", item: "CLARIVUE HYDRA+ TORIC 6pk", qty: 4, power: "-6.00", bc: "8.60", dia: "14.5", cyl: "-0.75", axis: "010", add: "", color: "", flagged: false }
    ]
  }
];

const PRESCRIBER_DIRECTORY = [
  { name: "Dr. Alena Brightwater, OD", clinic: "Larkspur Vision Center", city: "Boulder, CO", phone: "(555) 014-7702", npi: "1000000017", kind: "Domestic" },
  { name: "Dr. Nils Hammersmith, OD", clinic: "Harborview Eyecare", city: "Portland, ME", phone: "(555) 019-4418", npi: "1000000024", kind: "Domestic" },
  { name: "Dr. Corinne Vasquez, OD", clinic: "Desert Ridge Optometry", city: "Tempe, AZ", phone: "(555) 016-8890", npi: "1000000031", kind: "Domestic" },
  { name: "Dr. Priyanka Ostrowski, OD", clinic: "Blue Ridge Family Eyecare", city: "Asheville, NC", phone: "(555) 017-9925", npi: "1000000048", kind: "Domestic" },
  { name: "Dr. Marcus Feldbrook, OD", clinic: "Cascade Sight Partners", city: "Olympia, WA", phone: "(555) 018-2204", npi: "1000000055", kind: "Domestic" },
  { name: "Dr. Hala Zaman, OD", clinic: "Lakeside Optical Group", city: "Madison, WI", phone: "(555) 012-6631", npi: "1000000062", kind: "Domestic" },
  { name: "Dr. Emeka Adeleye, OD", clinic: "Fort Bragg Vision Clinic", city: "Fayetteville, NC", phone: "(555) 011-3390", npi: "1000000079", kind: "Military" },
  { name: "Dr. Solenne Marchetti, OD", clinic: "Clinique Optique Rivoli", city: "Lyon, FR", phone: "+33 555 0164", npi: "-", kind: "International" },
  { name: "Dr. Beatriz Salgado, OD", clinic: "Vision Norte", city: "Monterrey, MX", phone: "+52 555 0188", npi: "-", kind: "International" }
];
