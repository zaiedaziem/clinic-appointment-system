const pptxgen = require('pptxgenjs');

// ---- Palette: "Teal Trust" (clinical/medical, trustworthy) ----
const PRIMARY = '028090';   // teal
const SECONDARY = '00A896'; // seafoam
const ACCENT = '02C39A';    // mint
const DARK = '0A2027';      // near-black navy (dark slides)
const LIGHT_BG = 'FFFFFF';
const PANEL_BG = 'F2F8F7';  // faint teal-tinted panel
const TEXT_DARK = '0A2027';
const MUTED = '5C7A80';
const DANGER = 'C2453D';

const FONT_HEAD = 'Cambria';
const FONT_BODY = 'Calibri';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.3 x 7.5
const PAGE_W = 13.33;
const PAGE_H = 7.5;

function icon(name, tone) {
  return `${__dirname}/${name}-${tone}.png`;
}

// Repeated motif: icon inside a colored circle
function iconCircle(slide, name, x, y, d, circleColor, tone) {
  slide.addShape('ellipse', { x, y, w: d, h: d, fill: { color: circleColor }, line: { type: 'none' } });
  const pad = d * 0.26;
  slide.addImage({ path: icon(name, tone), x: x + pad / 2, y: y + pad / 2, w: d - pad, h: d - pad });
}

function title(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.6, y: 0.5, w: PAGE_W - 1.2, h: 0.62,
    fontFace: FONT_HEAD, fontSize: 32, bold: true, color: TEXT_DARK,
    align: 'left', margin: 0,
    ...opts,
  });
}

function footer(slide, n) {
  slide.addText(`Clinic Appointment System  ·  Capstone Presentation`, {
    x: 0.6, y: PAGE_H - 0.45, w: 8, h: 0.3, fontFace: FONT_BODY, fontSize: 9, color: MUTED, margin: 0,
  });
  slide.addText(String(n), {
    x: PAGE_W - 1.0, y: PAGE_H - 0.45, w: 0.5, h: 0.3, fontFace: FONT_BODY, fontSize: 9, color: MUTED,
    align: 'right', margin: 0,
  });
}

// ============================================================
// Slide 1 - Title
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: DARK };

  // Decorative faint circles (motif, not a stripe)
  slide.addShape('ellipse', { x: 10.3, y: -1.6, w: 5, h: 5, fill: { color: PRIMARY, transparency: 70 }, line: { type: 'none' } });
  slide.addShape('ellipse', { x: 11.6, y: 4.8, w: 3.4, h: 3.4, fill: { color: SECONDARY, transparency: 70 }, line: { type: 'none' } });

  iconCircle(slide, 'calendar', 0.9, 1.35, 0.95, SECONDARY, 'white');

  slide.addText('Clinic Appointment System', {
    x: 0.9, y: 2.55, w: 11, h: 1.1, fontFace: FONT_HEAD, fontSize: 44, bold: true, color: LIGHT_BG, margin: 0,
  });
  slide.addText('Full-Stack Capstone Project', {
    x: 0.9, y: 3.55, w: 10, h: 0.55, fontFace: FONT_BODY, fontSize: 20, color: ACCENT, margin: 0,
  });
  slide.addText('React  ·  Spring Boot  ·  MongoDB Atlas  ·  JWT Authentication', {
    x: 0.9, y: 4.15, w: 10, h: 0.45, fontFace: FONT_BODY, fontSize: 14, color: 'CFE8E6', margin: 0,
  });

  slide.addText('Java Full-Stack AI Capstone  ·  Domain 3.3 - Appointment Booking System', {
    x: 0.9, y: PAGE_H - 0.9, w: 10, h: 0.35, fontFace: FONT_BODY, fontSize: 11, color: '7FA3A0', margin: 0,
  });
}

// ============================================================
// Slide 2 - Problem Statement
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'The Problem');

  slide.addText(
    'Booking a clinic appointment the old way is friction-heavy for everyone involved.',
    { x: 0.6, y: 1.35, w: 6.3, h: 0.8, fontFace: FONT_BODY, fontSize: 15, color: MUTED, margin: 0 }
  );

  const pains = [
    ['cross', 'Phone-only booking', 'Patients wait on hold; no visibility into real-time availability.'],
    ['cross', 'Manual double-booking risk', 'Front-desk staff can accidentally book the same slot twice.'],
    ['cross', 'No self-service history', 'Patients cannot see or cancel their own upcoming visits.'],
  ];

  let y = 2.35;
  pains.forEach(([ic, head, body]) => {
    iconCircle(slide, ic, 0.6, y, 0.55, DANGER, 'white');
    slide.addText(head, { x: 1.35, y: y - 0.02, w: 5.6, h: 0.35, fontFace: FONT_BODY, bold: true, fontSize: 14, color: TEXT_DARK, margin: 0 });
    slide.addText(body, { x: 1.35, y: y + 0.32, w: 5.6, h: 0.55, fontFace: FONT_BODY, fontSize: 11.5, color: MUTED, margin: 0 });
    y += 1.15;
  });

  // Right panel: the solution, framed as a card
  slide.addShape('roundRect', {
    x: 7.35, y: 1.35, w: 5.4, h: 5.3, rectRadius: 0.12,
    fill: { color: PANEL_BG }, line: { type: 'none' },
    shadow: { type: 'outer', color: '9BB8B5', opacity: 0.35, blur: 8, offset: 3, angle: 90 },
  });
  slide.addText('Our Solution', { x: 7.75, y: 1.65, w: 4.6, h: 0.45, fontFace: FONT_HEAD, bold: true, fontSize: 18, color: PRIMARY, margin: 0 });

  const wins = [
    ['check', 'Self-service booking, 24/7'],
    ['check', 'Server-enforced double-booking prevention'],
    ['check', 'Role-based patient / admin experience'],
    ['check', 'Live admin dashboard with real usage data'],
  ];
  let wy = 2.35;
  wins.forEach(([ic, text]) => {
    iconCircle(slide, ic, 7.75, wy, 0.4, ACCENT, 'white');
    slide.addText(text, { x: 8.35, y: wy + 0.02, w: 4.2, h: 0.5, fontFace: FONT_BODY, fontSize: 12.5, color: TEXT_DARK, margin: 0, valign: 'middle' });
    wy += 0.85;
  });

  footer(slide, 2);
}

// ============================================================
// Slide 3 - Tech Stack & Architecture
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'Architecture & Tech Stack');

  const stack = [
    ['react', 'React', 'Frontend SPA', 'Vite, React Router, Context API'],
    ['spring', 'Spring Boot 4.1', 'REST API', 'Controllers, Services, Repositories'],
    ['mongodb', 'MongoDB Atlas', 'Database', 'Cloud-hosted, document model'],
    ['lock', 'JWT', 'Security', 'Stateless auth, role-based access'],
  ];

  const cardW = 2.75, gap = 0.32, startX = 0.6, y = 1.7, cardH = 2.5;
  stack.forEach(([ic, name, tag, sub], i) => {
    const x = startX + i * (cardW + gap);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH, rectRadius: 0.1,
      fill: { color: PANEL_BG }, line: { type: 'none' },
      shadow: { type: 'outer', color: '9BB8B5', opacity: 0.3, blur: 6, offset: 2, angle: 90 },
    });
    iconCircle(slide, ic, x + cardW / 2 - 0.45, y + 0.35, 0.9, i % 2 === 0 ? PRIMARY : SECONDARY, 'white');
    slide.addText(name, { x: x + 0.15, y: y + 1.4, w: cardW - 0.3, h: 0.35, align: 'center', fontFace: FONT_BODY, bold: true, fontSize: 14.5, color: TEXT_DARK, margin: 0 });
    slide.addText(tag, { x: x + 0.15, y: y + 1.72, w: cardW - 0.3, h: 0.3, align: 'center', fontFace: FONT_BODY, fontSize: 11, color: ACCENT, bold: true, margin: 0 });
    slide.addText(sub, { x: x + 0.15, y: y + 2.02, w: cardW - 0.3, h: 0.4, align: 'center', fontFace: FONT_BODY, fontSize: 9.5, color: MUTED, margin: 0 });
  });

  // Flow row underneath
  slide.addText('Request Flow', { x: 0.6, y: 4.55, w: 4, h: 0.35, fontFace: FONT_HEAD, bold: true, fontSize: 15, color: PRIMARY, margin: 0 });

  const flow = ['Browser (React)', 'Vite Dev Proxy', 'Spring Boot API', 'MongoDB Atlas'];
  const fW = 2.65, fGap = 0.42, fY = 5.15, fH = 0.75;
  flow.forEach((label, i) => {
    const x = 0.6 + i * (fW + fGap);
    slide.addShape('roundRect', {
      x, y: fY, w: fW, h: fH, rectRadius: 0.09,
      fill: { color: i === flow.length - 1 ? SECONDARY : PRIMARY }, line: { type: 'none' },
    });
    slide.addText(label, { x, y: fY, w: fW, h: fH, align: 'center', valign: 'middle', fontFace: FONT_BODY, bold: true, fontSize: 11.5, color: LIGHT_BG, margin: 0 });
    if (i < flow.length - 1) {
      slide.addText('→', { x: x + fW, y: fY, w: fGap, h: fH, align: 'center', valign: 'middle', fontFace: FONT_BODY, fontSize: 18, bold: true, color: MUTED, margin: 0 });
    }
  });

  slide.addText('JWT issued at login travels as an Authorization header on every protected request; Spring Security validates it before any controller runs.', {
    x: 0.6, y: 6.15, w: 11.8, h: 0.5, fontFace: FONT_BODY, fontSize: 11, italic: true, color: MUTED, margin: 0,
  });

  footer(slide, 3);
}

// ============================================================
// Slide 4 - Data Model
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'Data Model');

  slide.addText('Three MongoDB collections, matching the brief’s required User / Main-Entity / Transaction-Entity pattern.', {
    x: 0.6, y: 1.3, w: 11.8, h: 0.4, fontFace: FONT_BODY, fontSize: 13, color: MUTED, margin: 0,
  });

  const entities = [
    ['user', 'User', ['name, email (unique, indexed)', 'passwordHash (BCrypt)', 'role: ADMIN | PATIENT']],
    ['clipboard', 'ClinicService', ['name (indexed for search)', 'durationMinutes', 'active (soft-delete flag)']],
    ['calendar', 'Appointment', ['patientId, serviceId (indexed)', 'appointmentDateTime (indexed)', 'status: PENDING | CONFIRMED | CANCELLED']],
  ];

  const cardW = 3.55, gap = 0.5, startX = 0.6, y = 2.0, cardH = 3.0;
  entities.forEach(([ic, name, fields], i) => {
    const x = startX + i * (cardW + gap);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH, rectRadius: 0.1,
      fill: { color: PANEL_BG }, line: { color: i === 1 ? ACCENT : 'DCE9E7', width: i === 1 ? 1.5 : 1 },
      shadow: { type: 'outer', color: '9BB8B5', opacity: 0.3, blur: 6, offset: 2, angle: 90 },
    });
    iconCircle(slide, ic, x + 0.25, y + 0.25, 0.55, i === 1 ? ACCENT : PRIMARY, 'white');
    slide.addText(name, { x: x + 0.95, y: y + 0.28, w: cardW - 1.1, h: 0.5, valign: 'middle', fontFace: FONT_BODY, bold: true, fontSize: 15, color: TEXT_DARK, margin: 0 });

    const bullets = fields.map((f, idx) => ({ text: f, options: { bullet: { code: '2022', indent: 12 }, color: MUTED, fontSize: 10.5, breakLine: idx < fields.length - 1, paraSpaceAfter: 8 } }));
    slide.addText(bullets, { x: x + 0.3, y: y + 1.0, w: cardW - 0.6, h: 1.8, fontFace: FONT_BODY, margin: 0 });

    if (i < entities.length - 1) {
      slide.addText('→', { x: x + cardW, y, w: gap, h: cardH, align: 'center', valign: 'middle', fontFace: FONT_BODY, fontSize: 22, bold: true, color: SECONDARY, margin: 0 });
    }
  });

  slide.addShape('roundRect', {
    x: 0.6, y: 5.35, w: 12.1, h: 1.25, rectRadius: 0.1, fill: { color: DARK }, line: { type: 'none' },
  });
  iconCircle(slide, 'search', 0.9, 5.65, 0.65, ACCENT, 'dark');
  slide.addText([
    { text: 'Index choice worth explaining:  ', options: { bold: true, color: ACCENT } },
    { text: '@Indexed(unique = true) on User.email enforces "email must be unique" at the database layer, not just in application code — and appointmentDateTime is indexed since it’s the field the double-booking check queries on every single booking attempt.', options: { color: 'E4F2F0' } },
  ], { x: 1.75, y: 5.5, w: 10.7, h: 0.95, valign: 'middle', fontFace: FONT_BODY, fontSize: 11, margin: 0 });

  footer(slide, 4);
}

// ============================================================
// Slide 5 - Main User Flow
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'Main User Flow — Patient Journey');

  const steps = [
    ['user', 'Register / Login', 'JWT issued, role = PATIENT'],
    ['search', 'Browse Services', 'Search, sort, paginate'],
    ['calendar', 'Book Appointment', 'Business rules enforced'],
    ['clipboard', 'My Appointments', 'View & cancel own records'],
  ];

  const cardW = 2.65, gap = 0.55, startX = 0.75, y = 2.3, cardH = 2.6;
  steps.forEach(([ic, name, sub], i) => {
    const x = startX + i * (cardW + gap);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH, rectRadius: 0.1, fill: { color: PANEL_BG }, line: { type: 'none' },
      shadow: { type: 'outer', color: '9BB8B5', opacity: 0.3, blur: 6, offset: 2, angle: 90 },
    });
    slide.addShape('ellipse', {
      x: x + cardW / 2 - 0.28, y: y - 0.28, w: 0.56, h: 0.56, fill: { color: SECONDARY }, line: { color: LIGHT_BG, width: 3 },
    });
    slide.addText(String(i + 1), { x: x + cardW / 2 - 0.28, y: y - 0.28, w: 0.56, h: 0.56, align: 'center', valign: 'middle', fontFace: FONT_BODY, bold: true, fontSize: 16, color: LIGHT_BG, margin: 0 });

    iconCircle(slide, ic, x + cardW / 2 - 0.4, y + 0.45, 0.8, PRIMARY, 'white');
    slide.addText(name, { x: x + 0.15, y: y + 1.4, w: cardW - 0.3, h: 0.55, align: 'center', fontFace: FONT_BODY, bold: true, fontSize: 13, color: TEXT_DARK, margin: 0 });
    slide.addText(sub, { x: x + 0.15, y: y + 1.9, w: cardW - 0.3, h: 0.6, align: 'center', fontFace: FONT_BODY, fontSize: 10, color: MUTED, margin: 0 });

    if (i < steps.length - 1) {
      slide.addText('→', { x: x + cardW, y, w: gap, h: cardH, align: 'center', valign: 'middle', fontFace: FONT_BODY, fontSize: 20, bold: true, color: SECONDARY, margin: 0 });
    }
  });

  slide.addText('Admins follow the same login, then land on a role-aware Dashboard instead of the services list.', {
    x: 0.75, y: 5.5, w: 11.5, h: 0.4, fontFace: FONT_BODY, italic: true, fontSize: 12, color: MUTED, margin: 0,
  });

  footer(slide, 5);
}

// ============================================================
// Slide 6 - Admin Functionality
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'Admin Functionality');

  const rows = [
    ['admin', 'Dashboard', 'Live stats: active/inactive services, appointment status breakdown, upcoming count, most-booked services'],
    ['clipboard', 'Manage Services', 'Create, edit, deactivate (soft-delete), and permanently delete inactive services'],
    ['calendar', 'All Appointments', 'View every patient’s bookings, filter by status, confirm or cancel any record'],
  ];

  let y = 1.55;
  rows.forEach(([ic, head, body]) => {
    slide.addShape('roundRect', {
      x: 0.6, y, w: 12.1, h: 1.5, rectRadius: 0.1, fill: { color: PANEL_BG }, line: { type: 'none' },
      shadow: { type: 'outer', color: '9BB8B5', opacity: 0.25, blur: 5, offset: 2, angle: 90 },
    });
    iconCircle(slide, ic, 0.95, y + 0.35, 0.8, PRIMARY, 'white');
    slide.addText(head, { x: 2.0, y: y + 0.2, w: 4.5, h: 0.4, fontFace: FONT_BODY, bold: true, fontSize: 15, color: TEXT_DARK, margin: 0 });
    slide.addText(body, { x: 2.0, y: y + 0.62, w: 9.9, h: 0.7, fontFace: FONT_BODY, fontSize: 11.5, color: MUTED, margin: 0 });
    y += 1.75;
  });

  footer(slide, 6);
}

// ============================================================
// Slide 7 - Business Rules
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'Business Rules — Server-Enforced');

  slide.addText('Every rule is checked in AppointmentService before a booking is saved — never trusted from the frontend alone.', {
    x: 0.6, y: 1.3, w: 11.8, h: 0.4, fontFace: FONT_BODY, fontSize: 13, color: MUTED, margin: 0,
  });

  const rules = [
    ['ban', 'No Double-Booking', 'A service + exact date/time combo can only have one non-cancelled appointment. Cancelling frees the slot.'],
    ['ban', 'No Past-Date Bookings', 'Enforced twice: @Future validation on the DTO, and a server-side re-check in the service layer.'],
    ['ban', 'No Booking Inactive Services', 'A deactivated service immediately stops being bookable, even if the frontend still shows it briefly.'],
  ];

  const cardW = 3.75, gap = 0.4, startX = 0.6, y = 2.15, cardH = 3.3;
  rules.forEach(([ic, head, body], i) => {
    const x = startX + i * (cardW + gap);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH, rectRadius: 0.1, fill: { color: PANEL_BG }, line: { type: 'none' },
      shadow: { type: 'outer', color: '9BB8B5', opacity: 0.3, blur: 6, offset: 2, angle: 90 },
    });
    iconCircle(slide, ic, x + cardW / 2 - 0.4, y + 0.35, 0.8, DANGER, 'white');
    slide.addText(head, { x: x + 0.2, y: y + 1.35, w: cardW - 0.4, h: 0.6, align: 'center', fontFace: FONT_BODY, bold: true, fontSize: 13.5, color: TEXT_DARK, margin: 0 });
    slide.addText(body, { x: x + 0.25, y: y + 1.95, w: cardW - 0.5, h: 1.2, align: 'center', fontFace: FONT_BODY, fontSize: 10.5, color: MUTED, margin: 0 });
  });

  footer(slide, 7);
}

// ============================================================
// Slide 8 - Auth & Protected Routes
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'Authentication & Protected Routes');

  // JWT flow, left column
  slide.addText('JWT Flow', { x: 0.6, y: 1.35, w: 4, h: 0.35, fontFace: FONT_HEAD, bold: true, fontSize: 15, color: PRIMARY, margin: 0 });
  const flow = ['Login (email + password)', 'BCrypt verified → token signed', 'Token stored client-side', 'Sent as Bearer header on every request'];
  let fy = 1.85;
  flow.forEach((step, i) => {
    slide.addShape('ellipse', { x: 0.6, y: fy, w: 0.38, h: 0.38, fill: { color: SECONDARY }, line: { type: 'none' } });
    slide.addText(String(i + 1), { x: 0.6, y: fy, w: 0.38, h: 0.38, align: 'center', valign: 'middle', fontFace: FONT_BODY, bold: true, fontSize: 12, color: LIGHT_BG, margin: 0 });
    slide.addText(step, { x: 1.15, y: fy, w: 4.9, h: 0.38, valign: 'middle', fontFace: FONT_BODY, fontSize: 11.5, color: TEXT_DARK, margin: 0 });
    fy += 0.62;
  });

  // Role table, right column
  slide.addText('Role-Based Access (double-enforced)', { x: 6.2, y: 1.35, w: 6.3, h: 0.35, fontFace: FONT_HEAD, bold: true, fontSize: 15, color: PRIMARY, margin: 0 });

  const tableRows = [
    [{ text: 'Action', options: { bold: true, fill: { color: PRIMARY }, color: LIGHT_BG } }, { text: 'Patient', options: { bold: true, fill: { color: PRIMARY }, color: LIGHT_BG, align: 'center' } }, { text: 'Admin', options: { bold: true, fill: { color: PRIMARY }, color: LIGHT_BG, align: 'center' } }],
    ['Book an appointment', 'check', 'check'],
    ['View own appointments', 'check', 'check'],
    ['View ALL appointments', 'cross', 'check'],
    ['Manage services (CRUD)', 'cross', 'check'],
    ['View admin dashboard', 'cross', 'check'],
  ].map((row, ri) => {
    if (ri === 0) return row;
    const [label, p, a] = row;
    return [
      { text: label, options: { color: TEXT_DARK, fontSize: 11 } },
      { text: p === 'check' ? '✓' : '—', options: { align: 'center', color: p === 'check' ? ACCENT : 'C9D6D5', bold: true, fontSize: 13 } },
      { text: a === 'check' ? '✓' : '—', options: { align: 'center', color: a === 'check' ? ACCENT : 'C9D6D5', bold: true, fontSize: 13 } },
    ];
  });

  slide.addTable(tableRows, {
    x: 6.2, y: 1.85, w: 6.3, h: 3.1,
    colW: [3.4, 1.45, 1.45],
    fontFace: FONT_BODY, fontSize: 11, border: { type: 'solid', color: 'DCE9E7', pt: 0.75 },
    autoPage: false, valign: 'middle', margin: [4, 6, 4, 6],
  });

  // Bottom callout
  slide.addShape('roundRect', { x: 0.6, y: 5.3, w: 12.1, h: 1.3, rectRadius: 0.1, fill: { color: DARK }, line: { type: 'none' } });
  iconCircle(slide, 'lock', 0.9, 5.6, 0.7, ACCENT, 'dark');
  slide.addText([
    { text: 'Two layers, not one:  ', options: { bold: true, color: ACCENT } },
    { text: 'React’s ProtectedRoute/AdminRoute hide nav links and redirect — but the real gate is SecurityConfig on the backend (hasRole("ADMIN")), so a patient can never reach admin data just by guessing a URL.', options: { color: 'E4F2F0' } },
  ], { x: 1.8, y: 5.45, w: 10.6, h: 1.0, valign: 'middle', fontFace: FONT_BODY, fontSize: 11, margin: 0 });

  footer(slide, 8);
}

// ============================================================
// Slide 9 - Search / Filter / Sort / Pagination
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'Search, Filter, Sort & Pagination');

  slide.addText('Required on every listing endpoint — built once as a shared pattern, reused across Services and Appointments.', {
    x: 0.6, y: 1.3, w: 11.8, h: 0.4, fontFace: FONT_BODY, fontSize: 13, color: MUTED, margin: 0,
  });

  const features = [
    ['search', 'Search', '"q" keyword, case-insensitive regex match on service name'],
    ['layers', 'Filter', 'By active/inactive (services) or status (appointments)'],
    ['chart', 'Sort', 'Whitelisted fields only — blocks arbitrary/unsafe sort input'],
    ['clipboard', 'Paginate', 'page + size params, returned as a consistent PagedResponse<T>'],
  ];

  const cardW = 2.75, gap = 0.32, startX = 0.6, y = 2.05, cardH = 2.0;
  features.forEach(([ic, name, body], i) => {
    const x = startX + i * (cardW + gap);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH, rectRadius: 0.1, fill: { color: PANEL_BG }, line: { type: 'none' },
      shadow: { type: 'outer', color: '9BB8B5', opacity: 0.3, blur: 6, offset: 2, angle: 90 },
    });
    iconCircle(slide, ic, x + cardW / 2 - 0.35, y + 0.25, 0.7, SECONDARY, 'white');
    slide.addText(name, { x: x + 0.15, y: y + 1.05, w: cardW - 0.3, h: 0.32, align: 'center', fontFace: FONT_BODY, bold: true, fontSize: 13, color: TEXT_DARK, margin: 0 });
    slide.addText(body, { x: x + 0.2, y: y + 1.38, w: cardW - 0.4, h: 0.6, align: 'center', fontFace: FONT_BODY, fontSize: 9.5, color: MUTED, margin: 0 });
  });

  // Endpoint example
  slide.addShape('roundRect', { x: 0.6, y: 4.5, w: 12.1, h: 1.6, rectRadius: 0.1, fill: { color: DARK }, line: { type: 'none' } });
  slide.addText('GET /api/services?q=Consult&active=true&sortBy=name&direction=asc&page=0&size=5', {
    x: 0.95, y: 4.75, w: 11.5, h: 0.5, fontFace: 'Courier New', fontSize: 13, color: ACCENT, margin: 0,
  });
  slide.addText('One query, four requirements satisfied at once — built with MongoTemplate + dynamic Criteria, not four separate endpoints.', {
    x: 0.95, y: 5.3, w: 11.4, h: 0.6, fontFace: FONT_BODY, fontSize: 11, italic: true, color: 'CFE8E6', margin: 0,
  });

  footer(slide, 9);
}

// ============================================================
// Slide 10 - Aggregation & Reporting
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: LIGHT_BG };
  title(slide, 'MongoDB Aggregation & Reporting');

  slide.addText('The one true aggregation pipeline in the app — "Most Booked Services" on the admin dashboard.', {
    x: 0.6, y: 1.3, w: 11.8, h: 0.4, fontFace: FONT_BODY, fontSize: 13, color: MUTED, margin: 0,
  });

  // Code panel left
  slide.addShape('roundRect', { x: 0.6, y: 1.85, w: 6.5, h: 4.15, rectRadius: 0.1, fill: { color: DARK }, line: { type: 'none' } });
  const codeLines = [
    'db.appointments.aggregate([',
    '  { $group: {',
    '      _id: "$serviceName",',
    '      count: { $sum: 1 } } },',
    '  { $project: {',
    '      count: 1,',
    '      serviceName: "$_id" } },',
    '  { $sort: { count: -1 } },',
    '  { $limit: 5 }',
    '])',
  ];
  slide.addText(codeLines.join('\n'), {
    x: 0.9, y: 2.05, w: 5.9, h: 3.75, fontFace: 'Courier New', fontSize: 13, color: 'E4F2F0', margin: 0, lineSpacingMultiple: 1.15,
  });

  // Explanation right
  const stages = [
    ['$group', 'Bucket every appointment by serviceName, counting how many fall in each group'],
    ['$project', 'Rename Mongo’s default _id back to serviceName for the response DTO'],
    ['$sort / $limit', 'Highest count first, keep only the top 5'],
  ];
  let sy = 1.95;
  stages.forEach(([stage, body]) => {
    iconCircle(slide, 'chart', 7.35, sy, 0.55, ACCENT, 'white');
    slide.addText(stage, { x: 8.1, y: sy - 0.03, w: 4.5, h: 0.32, fontFace: 'Courier New', bold: true, fontSize: 13, color: PRIMARY, margin: 0 });
    slide.addText(body, { x: 8.1, y: sy + 0.28, w: 4.5, h: 0.6, fontFace: FONT_BODY, fontSize: 10.5, color: MUTED, margin: 0 });
    sy += 1.05;
  });

  slide.addText([
    { text: 'Same pattern already used in Day 10’s ', options: { color: MUTED } },
    { text: 'TicketReportService', options: { bold: true, color: PRIMARY, fontFace: 'Courier New' } },
    { text: ' — group / project / sort by a field, reapplied here to the clinic domain.', options: { color: MUTED } },
  ], { x: 7.35, y: 5.15, w: 5.4, h: 0.85, fontFace: FONT_BODY, fontSize: 10.5, margin: 0 });

  footer(slide, 10);
}

// ============================================================
// Slide 11 - Challenges & Solutions
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: DARK };
  slide.addText('Challenges Faced & How They Were Solved', {
    x: 0.6, y: 0.5, w: 12, h: 0.7, fontFace: FONT_HEAD, bold: true, fontSize: 30, color: LIGHT_BG, margin: 0,
  });

  const challenges = [
    ['Spring Boot 4.x moved the MongoDB connection property to spring.mongodb.uri', 'Traced it by extracting the built JAR’s dependency metadata to find the real property the MongoClient bean actually reads.'],
    ['JVM couldn’t open the DNS SRV lookup for mongodb+srv:// locally', 'Switched to Atlas’s standard connection string (explicit shard hosts), which skips the SRV/TXT DNS step entirely.'],
    ['A stale running backend silently served 404s for brand-new endpoints', 'Learned that a running JVM doesn’t hot-reload new classes — always fully stop and restart after adding a controller.'],
  ];

  let y = 1.55;
  challenges.forEach(([problem, solution], i) => {
    iconCircle(slide, 'bug', 0.7, y, 0.65, DANGER, 'white');
    slide.addText(problem, { x: 1.65, y: y - 0.02, w: 10.9, h: 0.6, fontFace: FONT_BODY, bold: true, fontSize: 13.5, color: LIGHT_BG, margin: 0 });
    slide.addText([
      { text: 'Fix:  ', options: { bold: true, color: ACCENT } },
      { text: solution, options: { color: 'CFE8E6' } },
    ], { x: 1.65, y: y + 0.58, w: 10.9, h: 0.6, fontFace: FONT_BODY, fontSize: 11.5, margin: 0 });
    y += 1.55;
  });

  footer(slide, 11);
  // footer text is dark-colored by default helper; override for dark bg
}

// ============================================================
// Slide 12 - Live Demo / Thank You
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: DARK };

  slide.addShape('ellipse', { x: -1.2, y: -1.4, w: 4.6, h: 4.6, fill: { color: PRIMARY, transparency: 70 }, line: { type: 'none' } });
  slide.addShape('ellipse', { x: 10.8, y: 4.6, w: 4, h: 4, fill: { color: SECONDARY, transparency: 70 }, line: { type: 'none' } });

  iconCircle(slide, 'check', PAGE_W / 2 - 0.55, 2.0, 1.1, ACCENT, 'dark');

  slide.addText('Live Demo', { x: 0, y: 3.3, w: PAGE_W, h: 0.9, align: 'center', fontFace: FONT_HEAD, bold: true, fontSize: 38, color: LIGHT_BG, margin: 0 });
  slide.addText('Patient flow  →  Admin flow  →  Dashboard  →  Q&A', {
    x: 0, y: 4.15, w: PAGE_W, h: 0.5, align: 'center', fontFace: FONT_BODY, fontSize: 16, color: ACCENT, margin: 0,
  });
  slide.addText('Thank you.', { x: 0, y: 5.9, w: PAGE_W, h: 0.5, align: 'center', fontFace: FONT_BODY, fontSize: 13, color: '7FA3A0', margin: 0 });
}

pres.writeFile({ fileName: `${__dirname}/clinic-appointment-system-presentation.pptx` }).then(() => {
  console.log('written');
});
