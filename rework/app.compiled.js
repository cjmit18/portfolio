const { useState } = React;
const G = { light: "#EAF3DE", mid: "#639922", text: "#3B6D11", dark: "#27500A" };
const A = { light: "#FAEEDA", mid: "#BA7517", text: "#633806" };
const R = { light: "#FCEBEB", mid: "#E24B4A", text: "#791F1F" };
const B = { light: "#E6F1FB", mid: "#378ADD", text: "#0C447C" };
const P = { light: "#EEEDFE", mid: "#7F77DD", text: "#3C3489" };
const T = { light: "#E1F5EE", mid: "#1D9E75", text: "#085041" };
const PHASES = [
  {
    id: "p0",
    title: "Environment & foundation",
    weeks: "Weeks 1-2",
    color: G.mid,
    items: [
      { id: "p0-1", text: "Install Qt6 via Qt Online Installer \u2014 select Qt 6.7+, Qt Creator, and the CMake component", prio: "c" },
      { id: "p0-2", text: "Set up CMake 3.25+ and configure the root CMakeLists.txt with Qt6 and SQLite targets", prio: "c" },
      { id: "p0-3", text: "Create project scaffold: src/, include/, tests/, resources/, docs/, data/", prio: "c" },
      { id: "p0-4", text: "Initialize Git repository and write a thorough .gitignore (build/, .qt/, *.user, *.db)", prio: "h" },
      { id: "p0-5", text: "Integrate Google Test via CMake FetchContent for the unit test suite", prio: "h" },
      { id: "p0-6", text: "Add nlohmann/json via CMake FetchContent for config files, data export, and future API work", prio: "n" },
      { id: "p0-7", text: "Design and document the complete SQLite schema in docs/schema.sql before writing any C++", prio: "c" },
      { id: "p0-8", text: "Implement DatabaseManager singleton: open/close connection, execute helpers, error propagation", prio: "c" },
      { id: "p0-9", text: "Write and run the initial migration \u2014 CREATE TABLE statements for all entities", prio: "c" },
      { id: "p0-10", text: "Implement schema versioning: schema_version table and applyMigration() upgrade logic", prio: "h" }
    ]
  },
  {
    id: "p1",
    title: "Data models & repositories",
    weeks: "Weeks 3-5",
    color: B.mid,
    items: [
      { id: "p1-1", text: "Define Employee class: id, name, employee_number, hire_date, status enum, notes", prio: "c" },
      { id: "p1-2", text: "Define Station class: id, name, category, description, min_staff, max_staff, requires_supervisor", prio: "c" },
      { id: "p1-3", text: "Define TrainingLevel enum: Observer(1), InTraining(2), Certified(3), Trainer(4)", prio: "c" },
      { id: "p1-4", text: "Define TrainingRecord: employee_id, station_id, level, trained_date, trained_by_id, expiry_date (nullable)", prio: "c" },
      { id: "p1-5", text: "Define ProductionSchedule + ScheduleStation: date, list of {station_id, batch_count, required_staff, priority}", prio: "c" },
      { id: "p1-6", text: "Define DailyAssignment: schedule_id, employee_id, station_id, assignment_method enum (Auto/Manual)", prio: "c" },
      { id: "p1-7", text: "Implement EmployeeRepository: insert, update, softDelete, findById, findAll, findByStatus", prio: "c" },
      { id: "p1-8", text: "Implement StationRepository: full CRUD + findByCategory, findAll sorted by name", prio: "c" },
      { id: "p1-9", text: "Implement TrainingRepository: CRUD + findByEmployee, findByStation, findByLevel, findExpiring(days)", prio: "c" },
      { id: "p1-10", text: "Implement ScheduleRepository: CRUD + findByDate, findByDateRange", prio: "c" },
      { id: "p1-11", text: "Implement AssignmentRepository: CRUD + findBySchedule, findByEmployee", prio: "h" },
      { id: "p1-12", text: "Unit tests for all repositories: insert, read, update, delete, and edge case queries", prio: "h" }
    ]
  },
  {
    id: "p2",
    title: "Business logic services",
    weeks: "Weeks 6-8",
    color: P.mid,
    items: [
      { id: "p2-1", text: "Implement EmployeeService: create, update, deactivate, field validation, duplicate number prevention", prio: "c" },
      { id: "p2-2", text: "Implement TrainingService: addRecord, updateLevel, enforce progression rules, expiry tracking", prio: "c" },
      { id: "p2-3", text: "Implement ScheduleService: buildDailySchedule, validateStationMinimums, detectConflicts", prio: "c" },
      { id: "p2-4", text: "Design the AssignmentEngine algorithm on a whiteboard before writing any code", prio: "c" },
      { id: "p2-5", text: "Implement AssignmentEngine::solve(): greedy \u2014 sort stations by priority, assign trainers first, certified next, in-training last", prio: "c" },
      { id: "p2-6", text: "Handle edge cases: understaffed station warning, no certified trainer available, all-expired certifications for a station", prio: "h" },
      { id: "p2-7", text: "Implement SuggestionEngine: identify surplus unassigned staff and find the stations they are closest to certifying in", prio: "h" },
      { id: "p2-8", text: "Implement SuggestionEngine::rankByPriority(): weight suggestions by station coverage deficit and trainer availability today", prio: "h" },
      { id: "p2-9", text: "Unit tests for all service classes \u2014 target 80%+ coverage, test every edge case explicitly", prio: "h" }
    ]
  },
  {
    id: "p3",
    title: "Qt UI \u2014 core views",
    weeks: "Weeks 9-12",
    color: A.mid,
    items: [
      { id: "p3-1", text: "Set up QMainWindow with QStackedWidget and a QListWidget sidebar for view navigation", prio: "c" },
      { id: "p3-2", text: "Implement EmployeeListView: QTableView + custom QAbstractTableModel + QSortFilterProxyModel for search and sort", prio: "c" },
      { id: "p3-3", text: "Implement EmployeeDetailWidget: view/edit mode toggle, QFormLayout, inline validation feedback", prio: "c" },
      { id: "p3-4", text: "Implement AddEmployeeDialog with complete field validation and visible error labels", prio: "c" },
      { id: "p3-5", text: "Implement StationListView + StationDetailWidget following the same pattern as the employee views", prio: "h" },
      { id: "p3-6", text: "Implement TrainingMatrixView: 2D grid (employees x stations), color coded by TrainingLevel with a legend", prio: "c" },
      { id: "p3-7", text: "Implement AddTrainingRecordDialog: employee picker, station picker, level dropdown, date pickers, trainer selector", prio: "c" },
      { id: "p3-8", text: "Implement EmployeeTrainingHistoryView: scrollable log with dates, levels, and trainer names", prio: "h" },
      { id: "p3-9", text: "Add color legend widget for training levels visible on the matrix and assignment views", prio: "n" }
    ]
  },
  {
    id: "p4",
    title: "Scheduling & assignment UI",
    weeks: "Weeks 13-15",
    color: T.mid,
    items: [
      { id: "p4-1", text: "Implement DailyScheduleBuilder: QDateEdit, station checkboxes, batch count spinners, required staff inputs per station", prio: "c" },
      { id: "p4-2", text: "Implement 'Run auto-assign' button that calls AssignmentEngine and immediately updates the results panel", prio: "c" },
      { id: "p4-3", text: "Implement AutoAssignmentView: per-station cards showing assigned employee names and remaining open slots", prio: "c" },
      { id: "p4-4", text: "Implement manual override: right-click reassignment with live re-validation against training records", prio: "h" },
      { id: "p4-5", text: "Implement TrainingSuggestionsPanel: employee name, recommended station, and plain-language rationale", prio: "c" },
      { id: "p4-6", text: "Implement warning system: red for understaffed stations, amber for certifications expiring within 30 days", prio: "h" },
      { id: "p4-7", text: "Implement DailyStaffOverview strip: present employees, unassigned count, quick-add to station", prio: "h" },
      { id: "p4-8", text: "Persist finalized assignments to DB with save timestamp and Auto vs Manual method flag", prio: "n" }
    ]
  },
  {
    id: "p5",
    title: "Reporting & analytics",
    weeks: "Weeks 16-18",
    color: { light: "#EEE7F9", mid: "#9575CD", text: "#4A3A79", dark: "#3A2E5C" },
    items: [
      { id: "p5-1", text: "Implement Training Coverage Report: per-station table showing % of active workforce at each certification level", prio: "h" },
      { id: "p5-2", text: "Implement Staff Readiness Report: stations ranked by how exposed they are when key employees are absent", prio: "h" },
      { id: "p5-3", text: "Implement Employee Training Report: full certification record printout for HR or compliance use", prio: "h" },
      { id: "p5-4", text: "Add Qt Charts: training coverage donut, station depth bar chart, training activity over time line chart", prio: "n" },
      { id: "p5-5", text: "Implement CSV export for training records via QTextStream", prio: "n" },
      { id: "p5-6", text: "Add QPrinter support for daily assignment sheets and employee training reports", prio: "n" },
      { id: "p5-7", text: "Implement expiry alert panel: certifications expiring within 30/60/90 days with a one-click renewal flow", prio: "h" }
    ]
  },
  {
    id: "p6",
    title: "Polish & deployment",
    weeks: "Weeks 19-21",
    color: R.mid,
    items: [
      { id: "p6-1", text: "Full integration test: simulate a complete day from schedule build through finalized assignments", prio: "c" },
      { id: "p6-2", text: "Error handling audit: all DB failures, null pointer guards, invalid state transitions", prio: "c" },
      { id: "p6-3", text: "UI/UX review pass: keyboard navigation, tab order through forms, dialog focus, hover tooltips", prio: "h" },
      { id: "p6-4", text: "Implement Settings view: company name, default expiry durations, backup path, auto-backup toggle", prio: "h" },
      { id: "p6-5", text: "Implement manual backup: in-app SQLite file copy utility with timestamped output filename", prio: "h" },
      { id: "p6-6", text: "Write user guide in Markdown or PDF: add employees, log training, build a schedule, run assignments", prio: "h" },
      { id: "p6-7", text: "Package for deployment: windeployqt (Windows) / macdeployqt (macOS) / AppImage (Linux)", prio: "c" },
      { id: "p6-8", text: "Employee onboarding session: walk kitchen staff through the app and gather real-world feedback", prio: "c" }
    ]
  }
];
const STACK = [
  { name: "Qt 6.7+", role: "GUI framework", tag: "required", tagC: G, desc: "Cross-platform UI toolkit with built-in SQL support, charts, printing, and a model/view architecture ideal for tabular data. Qt Creator simplifies development significantly." },
  { name: "SQLite 3", role: "Embedded database", tag: "required", tagC: G, desc: "Zero-configuration, file-based relational database via the Qt SQL module. No server to manage, trivially easy to back up (just copy the .db file), and fast enough for years of records." },
  { name: "CMake 3.25+", role: "Build system", tag: "required", tagC: G, desc: "Industry-standard C++ build tool. Handles Qt's MOC preprocessor, FetchContent dependencies, and cross-platform builds without manual makefile editing." },
  { name: "nlohmann/json", role: "JSON & config", tag: "recommended", tagC: B, desc: "Header-only C++ JSON library added via FetchContent. Used for app config files, data import/export, and any future REST API integration." },
  { name: "Google Test", role: "Unit testing", tag: "recommended", tagC: B, desc: "Write tests for repositories and services from day one. The AssignmentEngine and SuggestionEngine especially need rigorous coverage \u2014 bugs there affect real staffing decisions." },
  { name: "Qt Charts", role: "Analytics UI", tag: "optional", tagC: T, desc: "Built-in Qt module for training coverage dashboards, staffing depth bar charts, and historical trends. No extra dependencies needed." }
];
const ROADMAP = [
  {
    version: "v1.0",
    label: "MVP",
    color: G,
    desc: "Core functionality that solves the immediate problem \u2014 manage employees, track training, assign staff, and suggest cross-training.",
    features: ["Employee CRUD with status tracking (active, inactive, on leave)", "Station and skill management with categories and staffing minimums", "Training level tracking: Observer > In-training > Certified > Trainer", "Training matrix visualization \u2014 employees x stations, color coded by level", "Daily production schedule builder with per-station requirements", "Automatic staff assignment engine (greedy constraint satisfaction)", "Training suggestions for surplus staff based on station coverage deficits", "Certification expiry tracking with an alert panel", "Coverage and readiness reports, CSV export, print support"]
  },
  {
    version: "v1.5",
    label: "Production hardening",
    color: B,
    desc: "Everything that turns a working prototype into a reliable daily-use tool.",
    features: ["Manual assignment override with live re-validation", "Role-based access: admin, manager, trainer, employee views", "Shift pre-scheduling \u2014 plan multiple days in advance", "SOPs linked to stations as embedded PDFs or document links", "Immutable audit trail \u2014 log of every training record change and assignment override", "Notification system for expiring certifications (email or desktop alerts)", "Trainer workload view \u2014 who is supervising too many trainees at once?", "Qt Charts analytics dashboard with coverage trends and training velocity"]
  },
  {
    version: "v2.0",
    label: "Compliance & integration",
    color: P,
    desc: "Regulatory readiness and connection points into the broader cannabis software ecosystem.",
    features: ["Compliance report generator configurable for state cannabis commission formats", "Batch record integration: link daily staff assignments to production batch IDs", "REST API layer \u2014 external systems can read and write employee and training data", "Web companion UI: tablet-friendly interface served by a C++ backend (Drogon)", "QR code station check-in: scan on arrival to auto-assign yourself", "Multi-location support with per-location station inventories", "Payroll and HRIS integration hooks"]
  },
  {
    version: "v3.0+",
    label: "Long-term vision",
    color: A,
    desc: "Advanced possibilities as the operation scales or the technology landscape shifts.",
    features: ["Metrc / BioTrackTHC seed-to-sale integration \u2014 chain of custody tied to staff assignments", "IoT or RFID real-time station occupancy tracking", "AI scheduling optimizer trained on your historical assignment and quality data", "Predictive quality correlation: does training level predict batch defect rates?", "Mobile companion app for iOS and Android", "Regulatory auto-reporting to state cannabis commissions", "Blockchain-attested training certifications for external audits"]
  }
];
const MODULES = [
  ["EmployeeModule", "CRUD, status management, duplicate prevention, search and filter"],
  ["StationModule", "Kitchen station registry, categories, staffing requirements"],
  ["TrainingModule", "Record logging, level progression, expiry tracking"],
  ["AssignmentEngine", "Greedy CSP solver for daily staff-to-station allocation"],
  ["SuggestionEngine", "Surplus detection and cross-training opportunity ranking"],
  ["ScheduleModule", "Daily production plan builder and conflict validator"],
  ["ReportingModule", "Coverage reports, readiness analysis, CSV and PDF export"],
  ["DatabaseManager", "SQLite connection singleton, migrations, versioning"],
  ["SettingsModule", "Company config, backup utility, system preferences"]
];
function tag(c, label) {
  return /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, padding: "2px 8px", borderRadius: 4, background: c.light, color: c.dark, fontFamily: "var(--font-mono)" } }, label);
}
function Card({ children, accent, style = {} }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderLeft: accent ? `3px solid ${accent}` : void 0, borderRadius: "var(--border-radius-lg)", padding: "18px 20px", marginBottom: 14, ...style } }, children);
}
function CardH({ children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 } }, children);
}
function CardS({ children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)", marginBottom: 14 } }, children);
}
function G2({ children, gap = 14 }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap } }, children);
}
function G3({ children, gap = 12 }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap } }, children);
}
function Sec({ title, sub }) {
  return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 5px" } }, title), sub && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 } }, sub));
}
function OverviewTab() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Sec, { title: "Project overview", sub: "A purpose-built operations tool for regulated cannabis kitchen environments \u2014 well beyond generic staff tracking." }), /* @__PURE__ */ React.createElement(G2, null, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "The problem"), /* @__PURE__ */ React.createElement(CardS, null, "// what this app solves"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65, margin: 0 } }, "In a cannabis kitchen, product quality, compliance, and safety depend entirely on who is doing what. Misassigning an untrained employee to infusion, dosing, or extraction is a regulatory, safety, and product risk simultaneously. Managers currently handle this in their heads, on whiteboards, or in spreadsheets that do not enforce rules, expire certifications, or suggest improvements.")), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Industry context"), /* @__PURE__ */ React.createElement(CardS, null, "// cannabis kitchen specifics"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65, margin: 0 } }, "Cannabis operations are state-regulated, audit-prone, and batch-tracked. Training records may need to be produced on demand for a compliance inspector. Certifications can legally expire. Stations involve hazardous equipment and strict SOPs. This app is designed compliance-aware from day one so those features can be added without rearchitecting anything."))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Design principles"), /* @__PURE__ */ React.createElement(CardS, null, "// values baked into every architecture decision"), /* @__PURE__ */ React.createElement(G3, { gap: 10 }, [["Offline first", "SQLite with no cloud dependency. Works in a facility with restricted internet access."], ["Compliance ready", "Schema and export design anticipates regulatory reporting from the start."], ["Operator focused", "Kitchen managers are not developers. The UI must be fast and unambiguous."], ["Evolvable", "Layered architecture means UI, logic, and data can be replaced independently."], ["Traceable", "Every training record, assignment, and override is logged with who and when."], ["Single language", "C++ throughout. No context switching between a backend and a frontend language."]].map(([t, d]) => /* @__PURE__ */ React.createElement("div", { key: t, style: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 5 } }, t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.55 } }, d))))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Suggested app names"), /* @__PURE__ */ React.createElement(CardS, null, "// pick one or bring your own"), /* @__PURE__ */ React.createElement(G3, { gap: 10 }, [["StationIQ", "Intelligent station assignment. Clean and professional."], ["FloorOps", "Ops-focused, kitchen-floor feel. Simple and memorable."], ["CertTrack", "Puts training and certification front and center."], ["KitchenGrid", "References the assignment grid that is the core visual."], ["PostUp", "Kitchen slang for take your station. Unexpected and memorable."], ["DispatchPro", "Emphasizes the daily dispatch and assignment workflow."]].map(([n, d]) => /* @__PURE__ */ React.createElement("div", { key: n, style: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: G.text, marginBottom: 4 } }, n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--color-text-secondary)" } }, d))))));
}
function StackTab() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Sec, { title: "Tech stack", sub: "Primary recommendation: Qt6 desktop app. All dependencies are open source, cross-platform, and battle-tested." }), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Primary stack \u2014 Qt6 desktop"), /* @__PURE__ */ React.createElement(CardS, null, "// recommended for a single-location kitchen workstation or manager laptop"), /* @__PURE__ */ React.createElement(G2, { gap: 12 }, STACK.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.name, style: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" } }, s.name), tag(s.tagC, s.tag)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: G.text, fontFamily: "var(--font-mono)", marginBottom: 8 } }, s.role), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 } }, s.desc))))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Alternative stack \u2014 web-based (Drogon)"), /* @__PURE__ */ React.createElement(CardS, null, "// choose this path if you need tablet access across the kitchen or multi-user from day one"), /* @__PURE__ */ React.createElement(G2, { gap: 12 }, [["Drogon", "C++ web backend", B, "High-performance C++ HTTP/WebSocket framework. Choose this path if you want the app accessible from any tablet or computer on the kitchen network."], ["PostgreSQL", "Server database", B, "Pairs with Drogon for multi-user network-accessible storage. More to manage than SQLite but valuable for multi-location or concurrent access."], ["libpqxx", "PostgreSQL C++ client", T, "Official PostgreSQL C++ client. Replaces Qt SQL in the web-backend path. RAII-based API with full async support."], ["React / HTML", "Web frontend", T, "A thin web UI served by the Drogon backend. Separates display from core C++ logic and works from any browser including kitchen tablets."]].map(([n, r, c, d]) => /* @__PURE__ */ React.createElement("div", { key: n, style: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "14px 16px", opacity: 0.85 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" } }, n), tag(c, "optional")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: B.text, fontFamily: "var(--font-mono)", marginBottom: 8 } }, r), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 } }, d))))), /* @__PURE__ */ React.createElement(G2, null, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Why C++ for a business app?"), /* @__PURE__ */ React.createElement(CardS, null, "// less common, but a strong choice here"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [["You already know it", "No context switching. You are active in C++ through coursework and your game engine \u2014 one language keeps everything in your head."], ["Qt6 is genuinely excellent", "Mature model/view architecture, built-in SQL and chart support. Qt Creator is a capable IDE for this exact workload."], ["Performance headroom", "The assignment engine is a constraint satisfaction problem. It will always be fast in C++ regardless of how large the operation grows."], ["Portfolio range", "A production C++ business app alongside a game engine demonstrates the language across very different domains."]].map(([t, d]) => /* @__PURE__ */ React.createElement("div", { key: t }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 } }, t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.55 } }, d))))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "CMakeLists skeleton"), /* @__PURE__ */ React.createElement(CardS, null, "// starting point for your root CMakeLists.txt"), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--color-background-tertiary)", borderRadius: "var(--border-radius-md)", padding: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.9 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-text-tertiary)" } }, "cmake_minimum_required(VERSION 3.25)"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-text-tertiary)" } }, "project(StationIQ VERSION 0.1)"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-text-tertiary)" } }, "set(CMAKE_CXX_STANDARD 20)"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "find_package"), "(Qt6 REQUIRED COMPONENTS", /* @__PURE__ */ React.createElement("br", null), "  ", "Core Widgets Sql Charts PrintSupport)", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-text-tertiary)" } }, "# nlohmann/json and Google Test"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "include"), "(FetchContent)", /* @__PURE__ */ React.createElement("br", null), "FetchContent_Declare(json URL ...)", /* @__PURE__ */ React.createElement("br", null), "FetchContent_Declare(googletest URL ...)", /* @__PURE__ */ React.createElement("br", null), "FetchContent_MakeAvailable(json googletest)", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "add_subdirectory"), "(src)", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "add_subdirectory"), "(tests)"))));
}
function ArchTab() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Sec, { title: "Architecture", sub: "Layered design: UI is separate from business logic, which is separate from data access. Any layer can be replaced without touching the others." }), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "System layers"), /* @__PURE__ */ React.createElement(CardS, null, "// top-down: UI ", ">", " services ", ">", " repositories ", ">", " storage"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, maxWidth: 520, margin: "0 auto" } }, [[G, "Qt UI layer", "MainWindow \xB7 views \xB7 dialogs \xB7 models \xB7 charts"], [P, "Service layer", "EmployeeService \xB7 TrainingService \xB7 AssignmentEngine \xB7 SuggestionEngine"], [B, "Repository layer", "EmployeeRepo \xB7 StationRepo \xB7 TrainingRepo \xB7 ScheduleRepo \xB7 AssignmentRepo"], [A, "DatabaseManager", "SQLite 3 via Qt SQL \xB7 connection singleton \xB7 schema migrations"]].map(([c, l, d], i) => /* @__PURE__ */ React.createElement("div", { key: l }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", background: c.light, border: `0.5px solid ${c.mid}`, borderRadius: "var(--border-radius-md)", padding: "12px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: c.dark } }, l), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: c.text, fontFamily: "var(--font-mono)", marginTop: 4 } }, d)), i < 3 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 16, lineHeight: 1.2 } }, "\u2195"))))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Core modules"), /* @__PURE__ */ React.createElement(CardS, null, "// nine modules, each with a single responsibility"), /* @__PURE__ */ React.createElement(G3, { gap: 10 }, MODULES.map(([n, d]) => /* @__PURE__ */ React.createElement("div", { key: n, style: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "11px 13px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 500, color: G.text, fontFamily: "var(--font-mono)", marginBottom: 5 } }, n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 } }, d))))), /* @__PURE__ */ React.createElement(G2, null, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Assignment algorithm"), /* @__PURE__ */ React.createElement(CardS, null, "// greedy constraint satisfaction, O(S x E)"), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--color-background-tertiary)", borderRadius: "var(--border-radius-md)", padding: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.9 } }, /* @__PURE__ */ React.createElement("span", { style: { color: P.text } }, "assign"), "(schedule, employees, records):", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-text-tertiary)" } }, "  // critical stations processed first"), /* @__PURE__ */ React.createElement("br", null), "  ", /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "for"), " station in schedule.sorted(priority):", /* @__PURE__ */ React.createElement("br", null), "    ", "eligible = records.filter(", /* @__PURE__ */ React.createElement("br", null), "      ", "station == station", /* @__PURE__ */ React.createElement("br", null), "      ", "AND level >= Certified AND NOT expired)", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "    ", "trainers = eligible.filter(level == Trainer)", /* @__PURE__ */ React.createElement("br", null), "    ", "certified = eligible.filter(level == Certified)", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "    ", "assign(trainers.take(required))", /* @__PURE__ */ React.createElement("br", null), "    ", "assign(certified.fill_remaining)", /* @__PURE__ */ React.createElement("br", null), "    ", /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "if"), " trainer_assigned:", /* @__PURE__ */ React.createElement("br", null), "      ", "assign(inTraining.take(1))", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "    ", /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "if"), " understaffed: flag(WARNING)", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-text-tertiary)" } }, "  // pass surplus to SuggestionEngine"), /* @__PURE__ */ React.createElement("br", null), "  ", /* @__PURE__ */ React.createElement("span", { style: { color: P.text } }, "suggest"), "(employees - assigned, deficits)")), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Suggestion algorithm"), /* @__PURE__ */ React.createElement(CardS, null, "// rank cross-training opportunities for surplus staff"), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--color-background-tertiary)", borderRadius: "var(--border-radius-md)", padding: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.9 } }, /* @__PURE__ */ React.createElement("span", { style: { color: P.text } }, "suggest"), "(surplus, deficits):", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "  ", /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "for"), " employee in surplus:", /* @__PURE__ */ React.createElement("br", null), "    ", "candidates = []", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "    ", /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "for"), " station in allStations:", /* @__PURE__ */ React.createElement("br", null), "      ", "level = employee.levelAt(station)", /* @__PURE__ */ React.createElement("br", null), "      ", /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "if"), " level < Certified:", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-text-tertiary)" } }, "        // urgency + proximity score"), /* @__PURE__ */ React.createElement("br", null), "        ", "score = deficit[station] * ", /* @__PURE__ */ React.createElement("span", { style: { color: A.text } }, "0.7"), /* @__PURE__ */ React.createElement("br", null), "               ", "+ proximity[level] * ", /* @__PURE__ */ React.createElement("span", { style: { color: A.text } }, "0.3"), /* @__PURE__ */ React.createElement("br", null), "        ", /* @__PURE__ */ React.createElement("span", { style: { color: G.text } }, "if"), " trainer_here_today:", /* @__PURE__ */ React.createElement("br", null), "          ", "score += ", /* @__PURE__ */ React.createElement("span", { style: { color: A.text } }, "0.2"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "        ", "candidates.append(station, score)", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "    ", "yield employee, candidates.top(", /* @__PURE__ */ React.createElement("span", { style: { color: A.text } }, "3"), ")"))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardH, null, "Key database entities"), /* @__PURE__ */ React.createElement(CardS, null, "// schema concepts \u2014 full SQL lives in docs/schema.sql"), /* @__PURE__ */ React.createElement(G3, { gap: 10 }, [["employees", ["id", "name", "employee_number", "hire_date", "status", "notes"]], ["stations", ["id", "name", "category", "min_staff", "max_staff", "requires_supervisor"]], ["training_records", ["id", "employee_id", "station_id", "level", "trained_date", "trained_by", "expiry_date"]], ["production_schedules", ["id", "date", "status (Draft/Active/Completed)"]], ["schedule_stations", ["schedule_id", "station_id", "batch_count", "required_staff", "priority"]], ["daily_assignments", ["id", "schedule_id", "employee_id", "station_id", "method", "created_at"]]].map(([t, f]) => /* @__PURE__ */ React.createElement("div", { key: t, style: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "11px 13px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 500, color: B.text, fontFamily: "var(--font-mono)", marginBottom: 6 } }, t), f.map((field) => /* @__PURE__ */ React.createElement("div", { key: field, style: { fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)", lineHeight: 1.8 } }, field)))))));
}
function RoadmapTab() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Sec, { title: "Feature roadmap", sub: "Start with v1.0 and build outward. Every item here solves a real problem in a regulated kitchen environment." }), ROADMAP.map((r) => /* @__PURE__ */ React.createElement(Card, { key: r.version, accent: r.color.mid }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" } }, r.version), tag(r.color, r.label)), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 14, lineHeight: 1.6 } }, r.desc), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, r.features.map((f, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 8, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("span", { style: { color: r.color.mid, fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 2, flexShrink: 0 } }, "->"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 } }, f)))))));
}
function ChecklistTab({ completed, toggle, expanded, togglePhase }) {
  const totalItems = PHASES.reduce((s, p) => s + p.items.length, 0);
  const done = completed.size;
  const pct = Math.round(done / totalItems * 100);
  const priL = { c: "critical", h: "high", n: "normal" };
  const priC = { c: { bg: R.light, text: R.text }, h: { bg: A.light, text: A.text }, n: { bg: "var(--color-background-secondary)", text: "var(--color-text-tertiary)" } };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Sec, { title: "Development checklist", sub: "7 phases, 66 tasks. Work through them in order \u2014 each phase depends on the previous one being solid. Click any item to mark it done." }), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12, marginBottom: 24 } }, [[pct + "%", "overall progress", true], [done, "tasks completed", false], [totalItems - done, "tasks remaining", false], [7, "phases", false]].map(([n, l, bar]) => /* @__PURE__ */ React.createElement("div", { key: l, style: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 26, fontWeight: 500, color: G.text } }, n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)", marginTop: 4 } }, l), bar && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, height: 3, background: "var(--color-border-tertiary)", borderRadius: 2, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", background: G.mid, width: pct + "%", borderRadius: 2, transition: "width .3s" } }))))), PHASES.map((phase) => {
    const pDone = phase.items.filter((i) => completed.has(i.id)).length;
    const isOpen = expanded.has(phase.id);
    return /* @__PURE__ */ React.createElement("div", { key: phase.id, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => togglePhase(phase.id), style: { display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: isOpen ? "8px 8px 0 0" : 8, cursor: "pointer", userSelect: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: pDone === phase.items.length ? G.mid : phase.color, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", flex: 1 } }, phase.title), /* @__PURE__ */ React.createElement("div", { style: { width: 60, height: 3, background: "var(--color-border-tertiary)", borderRadius: 2, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", background: phase.color, width: Math.round(pDone / phase.items.length * 100) + "%", borderRadius: 2, transition: "width .3s" } })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", padding: "2px 8px", borderRadius: 4 } }, pDone, "/", phase.items.length), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" } }, phase.weeks), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-text-tertiary)", fontSize: 10, display: "inline-block", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" } }, "\u25BC")), isOpen && /* @__PURE__ */ React.createElement("div", { style: { border: "0.5px solid var(--color-border-tertiary)", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" } }, phase.items.map((item, idx) => {
      const isDone = completed.has(item.id);
      const pc = priC[item.prio];
      return /* @__PURE__ */ React.createElement("div", { key: item.id, onClick: () => toggle(item.id), style: { display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 14px", borderBottom: idx < phase.items.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", background: isDone ? "var(--color-background-secondary)" : "var(--color-background-primary)", cursor: "pointer", opacity: isDone ? 0.5 : 1, userSelect: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 14, height: 14, borderRadius: 3, border: isDone ? "none" : "0.5px solid var(--color-border-secondary)", background: isDone ? G.mid : "transparent", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" } }, isDone && /* @__PURE__ */ React.createElement("span", { style: { color: "white", fontSize: 9, fontWeight: 500 } }, "\u2713")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6, flex: 1, textDecoration: isDone ? "line-through" : "none" } }, item.text), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, padding: "2px 6px", borderRadius: 3, background: pc.bg, color: pc.text, fontFamily: "var(--font-mono)", flexShrink: 0, marginTop: 3 } }, priL[item.prio]));
    })));
  }));
}
function App() {
  const [tab, setTab] = useState("overview");
  const [completed, setCompleted] = useState(() => /* @__PURE__ */ new Set());
  const [expanded, setExpanded] = useState(() => /* @__PURE__ */ new Set(["p0"]));
  const toggle = (id) => setCompleted((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const togglePhase = (id) => setExpanded((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const TABS = [["overview", "Overview"], ["stack", "Tech stack"], ["arch", "Architecture"], ["roadmap", "Roadmap"], ["checklist", "Dev checklist"]];
  return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-sans)", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement("div", { style: { borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", padding: "18px 24px 0", position: "sticky", top: 0, zIndex: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22, fontWeight: 500, color: G.text } }, "StationIQ"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontFamily: "var(--font-mono)", background: "var(--color-background-secondary)", color: "var(--color-text-tertiary)", padding: "2px 8px", borderRadius: 4 } }, "v0.1 \u2014 planning")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)", marginBottom: 16 } }, "cannabis kitchen operations & training management \xB7 C++20 / Qt6"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0 } }, TABS.map(([id, label]) => /* @__PURE__ */ React.createElement("button", { key: id, onClick: () => setTab(id), style: { background: "none", border: "none", borderBottom: tab === id ? `2px solid ${G.mid}` : "2px solid transparent", padding: "8px 16px", fontSize: 13, fontWeight: 500, color: tab === id ? G.text : "var(--color-text-secondary)", cursor: "pointer", transition: "color .15s,border-color .15s" } }, label)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "28px 24px", maxWidth: 980, margin: "0 auto" } }, tab === "overview" && /* @__PURE__ */ React.createElement(OverviewTab, null), tab === "stack" && /* @__PURE__ */ React.createElement(StackTab, null), tab === "arch" && /* @__PURE__ */ React.createElement(ArchTab, null), tab === "roadmap" && /* @__PURE__ */ React.createElement(RoadmapTab, null), tab === "checklist" && /* @__PURE__ */ React.createElement(ChecklistTab, { completed, toggle, expanded, togglePhase })));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
