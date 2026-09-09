/* ------------------------------------------------------------------
   Autopilot Demo - sample data
   Everything in this file is FICTIONAL. Names, addresses, emails,
   phone numbers, order numbers, prescribers and product names are all
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

/* Each order carries a `document`: what the scanned prescription
   actually says. The document is fixed - it is the source of truth the
   agent reads from and transcribes into the order. */
const ORDERS = [
  {
    id: "0192884512",
    docId: "100884509",
    customerId: "37882140",
    status: "In Progress",
    statusKind: "info",
    priority: "Normal",
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
    member: { first: "June", last: "Nakamura", dob: "09/30/2001", personId: "204120455", verify: "83816710" },
    prescriber: { name: "Dr. Marcus Feldbrook, OD", clinic: "Cascade Sight Partners", phone: "(555) 018-2204", npi: "1000000055" },
    lastExam: "01/08/2026", expires: "01/08/2028", issueDate: "01/10/2026",
    items: [
      { eye: "OD", item: "NORTHLIGHT AIR 24pk", qty: 1, power: "-3.25", bc: "8.70", dia: "14.2", cyl: "0.00", axis: "0", add: "", color: "", flagged: false },
      { eye: "OS", item: "NORTHLIGHT AIR 24pk", qty: 1, power: "-3.00", bc: "8.70", dia: "14.2", cyl: "0.00", axis: "0", add: "", color: "", flagged: false }
    ],
    document: {
      prescriberName: "Dr. Marcus Feldbrook, OD",
      prescriberClinic: "Cascade Sight Partners",
      prescriberPhone: "(555) 018-2204",
      prescriberNpi: "1000000055",
      signatureDate: "01/10/2026",
      examDate: "01/08/2026",
      issueDate: "01/10/2026",
      expiresDate: "01/08/2028",
      rx: [
        { eye: "OD", item: "NORTHLIGHT AIR 24pk", qty: 1, power: "-3.25", bc: "8.70", dia: "14.2", cyl: "0.00", axis: "0", add: "", color: "" },
        { eye: "OS", item: "NORTHLIGHT AIR 24pk", qty: 1, power: "-3.00", bc: "8.70", dia: "14.2", cyl: "0.00", axis: "0", add: "", color: "" }
      ]
    }
  },
  {
    id: "0192885017",
    docId: "100884612",
    customerId: "43880129",
    status: "New - Unverified",
    statusKind: "err",
    priority: "High",
    faxType: "Unclassified",
    received: "2026-09-09 09:22",
    ageMin: 2,
    releaseTime: "",
    takenDate: "2026-09-09 09:19",
    takenBy: "AUTO-INTAKE",
    rmaOrder: "",
    appliedRule: "Pending",
    callerId: "5550137745",
    customer: {
      name: "Rowan Alcaraz",
      phone: "(555) 013-7745",
      email: "rowan.alcaraz@example.com",
      street: "27 Windmere Court",
      city: "Frankfort", state: "KY", zip: "40601-2204"
    },
    member: { first: "Rowan", last: "Alcaraz", dob: "04/17/1990", personId: "204120880", verify: "83816991" },
    prescriber: null,
    lastExam: "", expires: "", issueDate: "",
    items: [],
    document: {
      prescriberName: "Dr. Corinne Vasquez, OD",
      prescriberClinic: "Desert Ridge Optometry",
      prescriberPhone: "(555) 016-8890",
      prescriberNpi: "1000000031",
      signatureDate: "03/18/2026",
      examDate: "03/15/2026",
      issueDate: "03/18/2026",
      expiresDate: "03/15/2027",
      rx: [
        { eye: "OD", item: "CLARIVUE HYDRA+ 12pk", qty: 2, power: "-1.75", bc: "8.40", dia: "14.0", cyl: "0.00", axis: "0", add: "", color: "" },
        { eye: "OS", item: "CLARIVUE HYDRA+ 12pk", qty: 2, power: "-2.00", bc: "8.40", dia: "14.0", cyl: "0.00", axis: "0", add: "", color: "" }
      ]
    }
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
