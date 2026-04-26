/* ═══════════════════════════════════════════════════
   EduTrack Pro — app.js
   Full Student Management System Logic
═══════════════════════════════════════════════════ */

'use strict';

/* ─── BRANCHES & PROGRAMS DATA ─────────────────────────── */
const BRANCHES = {
  'B.Tech': [
    'CSE', 'CSE - AI & ML', 'CSE - Data Science', 'CSE - Cyber Security',
    'CSE - Cloud Computing', 'CSE - IoT', 'CSE - Full Stack Development',
    'CS & AI', 'CS & Business Systems', 'Artificial Intelligence',
    'Data Science', 'Machine Learning', 'AIML',
    'ECE', 'EEE', 'Mechanical Engineering', 'Civil Engineering',
    'Chemical Engineering', 'Petroleum Engineering', 'Biotechnology',
    'Information Technology', 'Aerospace Engineering', 'Marine Engineering'
  ],
  'M.Tech': [
    'Computer Science & Engineering', 'Artificial Intelligence',
    'Data Science & Analytics', 'Machine Learning', 'Embedded Systems',
    'VLSI Design', 'Power Systems', 'Structural Engineering',
    'Environmental Engineering', 'Software Engineering',
    'Cyber Security', 'Robotics & Automation', 'Communication Systems'
  ],
  'MBA': ['General Management', 'Finance', 'Marketing', 'HR', 'Operations',
    'Business Analytics', 'International Business', 'IT Management'],
  'MCA': ['Computer Applications', 'Data Science', 'Cloud Computing', 'AI & ML'],
  'Ph.D': ['Computer Science', 'Electronics', 'Mechanical', 'Civil',
    'Physics', 'Chemistry', 'Mathematics', 'Management']
};

const BRANCH_SUBJECTS = {
  'CSE': {
    1: [
      {name:'Engineering Mathematics I', code:'MA101', credits:4, type:'Theory'},
      {name:'Engineering Physics', code:'PH101', credits:3, type:'Theory'},
      {name:'Engineering Chemistry', code:'CH101', credits:3, type:'Theory'},
      {name:'Programming in C', code:'CS101', credits:4, type:'Theory'},
      {name:'Programming Lab', code:'CS102', credits:2, type:'Lab'},
      {name:'English Communication', code:'EN101', credits:2, type:'Theory'}
    ],
    2: [
      {name:'Engineering Mathematics II', code:'MA201', credits:4, type:'Theory'},
      {name:'Data Structures', code:'CS201', credits:4, type:'Theory'},
      {name:'Digital Logic Design', code:'CS202', credits:3, type:'Theory'},
      {name:'Object Oriented Programming', code:'CS203', credits:4, type:'Theory'},
      {name:'OOP Lab', code:'CS204', credits:2, type:'Lab'},
      {name:'Data Structures Lab', code:'CS205', credits:2, type:'Lab'}
    ],
    3: [
      {name:'Discrete Mathematics', code:'CS301', credits:4, type:'Theory'},
      {name:'Computer Organization', code:'CS302', credits:3, type:'Theory'},
      {name:'Database Management Systems', code:'CS303', credits:4, type:'Theory'},
      {name:'Operating Systems', code:'CS304', credits:4, type:'Theory'},
      {name:'DBMS Lab', code:'CS305', credits:2, type:'Lab'},
      {name:'OS Lab', code:'CS306', credits:2, type:'Lab'}
    ],
    4: [
      {name:'Analysis of Algorithms', code:'CS401', credits:4, type:'Theory'},
      {name:'Computer Networks', code:'CS402', credits:4, type:'Theory'},
      {name:'Software Engineering', code:'CS403', credits:3, type:'Theory'},
      {name:'Theory of Computation', code:'CS404', credits:4, type:'Theory'},
      {name:'Networks Lab', code:'CS405', credits:2, type:'Lab'},
      {name:'Mini Project', code:'CS406', credits:2, type:'Project'}
    ],
    5: [
      {name:'Compiler Design', code:'CS501', credits:4, type:'Theory'},
      {name:'Machine Learning', code:'CS502', credits:4, type:'Theory'},
      {name:'Web Technologies', code:'CS503', credits:3, type:'Theory'},
      {name:'Cryptography & Security', code:'CS504', credits:3, type:'Theory'},
      {name:'ML Lab', code:'CS505', credits:2, type:'Lab'},
      {name:'Elective I', code:'CS506', credits:3, type:'Elective'}
    ],
    6: [
      {name:'Artificial Intelligence', code:'CS601', credits:4, type:'Theory'},
      {name:'Cloud Computing', code:'CS602', credits:3, type:'Theory'},
      {name:'Big Data Analytics', code:'CS603', credits:3, type:'Theory'},
      {name:'Mobile Application Development', code:'CS604', credits:3, type:'Theory'},
      {name:'AI Lab', code:'CS605', credits:2, type:'Lab'},
      {name:'Elective II', code:'CS606', credits:3, type:'Elective'}
    ],
    7: [
      {name:'Deep Learning', code:'CS701', credits:4, type:'Theory'},
      {name:'Internet of Things', code:'CS702', credits:3, type:'Theory'},
      {name:'Blockchain Technology', code:'CS703', credits:3, type:'Theory'},
      {name:'Project Phase I', code:'CS704', credits:4, type:'Project'},
      {name:'Elective III', code:'CS705', credits:3, type:'Elective'},
      {name:'Elective IV', code:'CS706', credits:3, type:'Elective'}
    ],
    8: [
      {name:'Project Phase II', code:'CS801', credits:10, type:'Project'},
      {name:'Industry Internship', code:'CS802', credits:4, type:'Project'},
      {name:'Technical Seminar', code:'CS803', credits:2, type:'Theory'},
      {name:'Elective V', code:'CS804', credits:3, type:'Elective'}
    ]
  }
};

const GRADE_SCALE = [
  {min:90, grade:'O',  gp:10},
  {min:80, grade:'A1', gp:9},
  {min:70, grade:'A2', gp:8},
  {min:60, grade:'B1', gp:7},
  {min:50, grade:'B2', gp:6},
  {min:40, grade:'C',  gp:5},
  {min:35, grade:'D',  gp:4},
  {min:0,  grade:'F',  gp:0}
];

/* ─── APP STATE ─────────────────────────────────────────── */
let state = {
  students: [],
  subjects: {},    // { branchKey: { sem: [...subjects] } }
  attendance: {},  // { studentId: { date: { subjectCode: 'P'|'A' } } }
  notifications: [],
  currentStudentId: null,  // for edit
  confirmCallback: null,
  editingSubject: null,    // { branch, sem, idx }
  activeView: 'grid'
};

/* Load from localStorage */
function loadState() {
  try {
    const s = localStorage.getItem('edutrack_students');
    if (s) state.students = JSON.parse(s);
    const sub = localStorage.getItem('edutrack_subjects');
    if (sub) state.subjects = JSON.parse(sub);
    const att = localStorage.getItem('edutrack_attendance');
    if (att) state.attendance = JSON.parse(att);
    const notifs = localStorage.getItem('edutrack_notifs');
    if (notifs) state.notifications = JSON.parse(notifs);
  } catch(e) { console.warn('Load error', e); }
}

function saveState() {
  localStorage.setItem('edutrack_students', JSON.stringify(state.students));
  localStorage.setItem('edutrack_subjects', JSON.stringify(state.subjects));
  localStorage.setItem('edutrack_attendance', JSON.stringify(state.attendance));
  localStorage.setItem('edutrack_notifs', JSON.stringify(state.notifications));
}

/* ─── ROLL ID GENERATOR ─────────────────────────────────── */
function generateRollId(program, branch, year, batch) {
  const programCode = {
    'B.Tech':'BT','M.Tech':'MT','MBA':'MB','MCA':'MC','Ph.D':'PD'
  }[program] || 'ST';

  const branchCode = branch
    ? branch.replace(/[^A-Za-z]/g,'').substring(0,3).toUpperCase()
    : 'GEN';

  const batchYear = batch ? batch.split('-')[0].slice(2) : '24';
  const count = state.students.filter(
    s => s.program === program && s.branch === branch
  ).length + 1;
  const seq = String(count).padStart(4, '0');
  return `${programCode}${batchYear}${branchCode}${seq}`;
}

/* ─── TOAST NOTIFICATIONS ───────────────────────────────── */
function showToast(msg, type = 'info') {
  const icons = { success:'fa-check-circle', error:'fa-times-circle', info:'fa-info-circle' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ─── NOTIFICATIONS ─────────────────────────────────────── */
function addNotification(msg, type = 'info') {
  const icons = { success:'fa-check', info:'fa-info', warn:'fa-exclamation', error:'fa-times' };
  state.notifications.unshift({
    id: Date.now(), msg, type,
    icon: icons[type] || 'fa-bell',
    time: new Date().toLocaleString()
  });
  if (state.notifications.length > 50) state.notifications.pop();
  saveState();
  updateNotifBadge();
  renderNotifications();
}

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  const count = state.notifications.length;
  badge.textContent = count > 0 ? count : '';
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  if (!state.notifications.length) {
    list.innerHTML = '<div class="empty-state"><i class="fas fa-bell-slash"></i><h3>No notifications</h3></div>';
    return;
  }
  list.innerHTML = state.notifications.map(n => `
    <div class="notif-item">
      <div class="notif-icon notif-${n.type}"><i class="fas ${n.icon}"></i></div>
      <div>
        <div class="notif-text">${n.msg}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

/* ─── NAVIGATION ────────────────────────────────────────── */
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  const titles = {
    dashboard:'Dashboard', students:'Students', attendance:'Attendance',
    marks:'Marks & Grades', subjects:'Subjects',
    reports:'Reports', notifications:'Notifications'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;

  if (page === 'dashboard') renderDashboard();
  if (page === 'attendance') renderAttendance();
  if (page === 'marks') renderMarksPage();
  if (page === 'subjects') renderSubjectsPage();
  if (page === 'reports') renderReports();
  if (page === 'notifications') renderNotifications();
}

/* ─── BRANCH SELECT HELPER ──────────────────────────────── */
function populateBranchSelect(selectId, program) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const branches = program ? (BRANCHES[program] || []) : Object.values(BRANCHES).flat();
  sel.innerHTML = `<option value="">All Branches</option>` +
    branches.map(b => `<option value="${b}">${b}</option>`).join('');
}

function populateAllBranchSelects() {
  // Filter selects
  const filterBranch = document.getElementById('filterBranch');
  if (filterBranch) {
    const allBranches = [...new Set(Object.values(BRANCHES).flat())];
    filterBranch.innerHTML = `<option value="">All Branches</option>` +
      allBranches.map(b => `<option value="${b}">${b}</option>`).join('');
  }
  const attBranch = document.getElementById('attBranch');
  if (attBranch) {
    const allBranches = [...new Set(Object.values(BRANCHES).flat())];
    attBranch.innerHTML = `<option value="">All Branches</option>` +
      allBranches.map(b => `<option value="${b}">${b}</option>`).join('');
  }
  const subjectBranch = document.getElementById('subjectBranchSel');
  if (subjectBranch) {
    const allBranches = [...new Set(Object.values(BRANCHES).flat())];
    subjectBranch.innerHTML = `<option value="">Select Branch</option>` +
      allBranches.map(b => `<option value="${b}">${b}</option>`).join('');
  }
}

/* ─── AVATAR COLORS ─────────────────────────────────────── */
const AVATAR_COLORS = [
  {bg:'rgba(245,197,24,0.2)', color:'#F5C518'},
  {bg:'rgba(0,201,167,0.2)', color:'#00C9A7'},
  {bg:'rgba(132,94,247,0.2)', color:'#845EF7'},
  {bg:'rgba(51,154,240,0.2)', color:'#339AF0'},
  {bg:'rgba(255,107,107,0.2)', color:'#FF6B6B'},
  {bg:'rgba(240,101,149,0.2)', color:'#F06595'},
  {bg:'rgba(255,146,43,0.2)', color:'#FF922B'},
  {bg:'rgba(32,201,151,0.2)', color:'#20C997'},
];
function getAvatarColor(name) {
  let h = 0;
  for (let c of (name || 'X')) h = (h*31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function getInitials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function getColorIdx(name) {
  let h = 0;
  for (let c of (name || 'X')) h = (h*31 + c.charCodeAt(0)) & 0xffffffff;
  return Math.abs(h) % 12;
}

/* ─── GRADE CALCULATION ─────────────────────────────────── */
function getGrade(marks) {
  for (const g of GRADE_SCALE) {
    if (marks >= g.min) return g;
  }
  return GRADE_SCALE[GRADE_SCALE.length - 1];
}

function calcCGPA(student) {
  if (!student.marks || !Object.keys(student.marks).length) return null;
  let totalCredits = 0, totalPoints = 0;
  for (const sem of Object.values(student.marks)) {
    for (const sub of sem) {
      if (sub.total !== undefined && sub.total !== '') {
        const total = Number(sub.total);
        const credits = Number(sub.credits) || 3;
        const gradeObj = getGrade(total);
        totalPoints += gradeObj.gp * credits;
        totalCredits += credits;
      }
    }
  }
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : null;
}

function calcAttendancePct(student) {
  const att = state.attendance[student.id];
  if (!att) return student.attendance || null;
  let present = 0, total = 0;
  for (const day of Object.values(att)) {
    for (const status of Object.values(day)) {
      total++;
      if (status === 'P') present++;
    }
  }
  return total ? Math.round((present / total) * 100) : (student.attendance || null);
}

/* ─── STUDENT RENDER ────────────────────────────────────── */
function getFilteredStudents() {
  const prog = document.getElementById('filterProgram')?.value || '';
  const year = document.getElementById('filterYear')?.value || '';
  const branch = document.getElementById('filterBranch')?.value || '';

  return state.students.filter(s => {
    if (prog && s.program !== prog) return false;
    if (year && String(s.year) !== year) return false;
    if (branch && s.branch !== branch) return false;
    return true;
  });
}

function renderStudents() {
  const students = getFilteredStudents();
  const grid = document.getElementById('studentGrid');
  const tbody = document.getElementById('studentTableBody');
  const empty = document.getElementById('studentsEmpty');

  if (!students.length) {
    grid.innerHTML = '';
    if (tbody) tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  // Update marks selector
  const marksSelEl = document.getElementById('marksStudentSel');
  if (marksSelEl) {
    marksSelEl.innerHTML = '<option value="">Select Student</option>' +
      state.students.map(s => `<option value="${s.id}">${s.name} (${s.rollId})</option>`).join('');
  }

  // GRID VIEW
  grid.innerHTML = students.map((s, i) => {
    const col = getAvatarColor(s.name);
    const cgpa = calcCGPA(s);
    const attPct = calcAttendancePct(s);
    const attColor = attPct >= 75 ? '#00C9A7' : attPct >= 60 ? '#F5C518' : '#FF6B6B';
    const colorIdx = getColorIdx(s.name);
    const barColors = ['#F5C518','#00C9A7','#845EF7','#339AF0','#FF6B6B','#F06595','#FF922B','#20C997','#74C0FC','#B197FC','#FFD43B','#63E6BE'];

    return `
    <div class="student-card" onclick="viewStudent('${s.id}')">
      <div class="student-card-accent" style="background:${barColors[colorIdx % barColors.length]}"></div>
      <div class="sc-header">
        <div class="sc-avatar" style="background:${col.bg};color:${col.color}">
          ${getInitials(s.name)}
        </div>
        <div>
          <div class="sc-name">${s.name}</div>
          <div class="sc-id">${s.rollId}</div>
        </div>
      </div>
      <div class="sc-tags">
        <span class="sc-tag tag-program">${s.program || '—'}</span>
        <span class="sc-tag tag-branch">${(s.branch || '—').split(' ').slice(0,2).join(' ')}</span>
        <span class="sc-tag tag-year">Year ${s.year || '—'}</span>
        ${s.batch ? `<span class="sc-tag tag-batch">${s.batch}</span>` : ''}
      </div>
      <div class="sc-metrics">
        <div class="sc-metric">
          <div class="sc-metric-val" style="color:${col.color}">${cgpa || 'N/A'}</div>
          <div class="sc-metric-label">CGPA</div>
        </div>
        <div class="sc-metric">
          <div class="sc-metric-val" style="color:${attColor}">${attPct !== null ? attPct + '%' : 'N/A'}</div>
          <div class="sc-metric-label">Attendance</div>
          ${attPct !== null ? `<div class="sc-att-bar"><div class="sc-att-fill" style="width:${attPct}%;background:${attColor}"></div></div>` : ''}
        </div>
      </div>
      <div class="sc-actions" onclick="event.stopPropagation()">
        <button class="sc-action-btn" onclick="viewStudent('${s.id}')"><i class="fas fa-eye"></i> View</button>
        <button class="sc-action-btn edit" onclick="editStudent('${s.id}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="sc-action-btn delete" onclick="confirmDelete('${s.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');

  // TABLE VIEW
  if (tbody) {
    tbody.innerHTML = students.map(s => {
      const cgpa = calcCGPA(s);
      const attPct = calcAttendancePct(s);
      const attColor = attPct >= 75 ? '#00C9A7' : attPct >= 60 ? '#F5C518' : '#FF6B6B';
      return `
      <tr>
        <td><span style="color:#F5C518;font-weight:700">${s.rollId}</span></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.program || '—'}</td>
        <td>${s.branch || '—'}</td>
        <td>Year ${s.year || '—'} / Sem ${s.semester || '—'}</td>
        <td>${cgpa || 'N/A'}</td>
        <td style="color:${attColor}">${attPct !== null ? attPct + '%' : 'N/A'}</td>
        <td>
          <button class="sc-action-btn" onclick="viewStudent('${s.id}')" style="flex:none;padding:5px 10px"><i class="fas fa-eye"></i></button>
          <button class="sc-action-btn edit" onclick="editStudent('${s.id}')" style="flex:none;padding:5px 10px"><i class="fas fa-edit"></i></button>
          <button class="sc-action-btn delete" onclick="confirmDelete('${s.id}')" style="flex:none;padding:5px 10px"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
    }).join('');
  }
}

/* ─── DASHBOARD ─────────────────────────────────────────── */
function renderDashboard() {
  const students = state.students;
  document.getElementById('statTotal').textContent = students.length;
  document.getElementById('statBtech').textContent = students.filter(s => s.program === 'B.Tech').length;
  document.getElementById('statMtech').textContent = students.filter(s => s.program === 'M.Tech').length;

  // Avg attendance
  const attVals = students.map(s => calcAttendancePct(s)).filter(v => v !== null);
  const avgAtt = attVals.length ? Math.round(attVals.reduce((a, b) => a + b, 0) / attVals.length) : 0;
  document.getElementById('statAttendance').textContent = avgAtt + '%';

  // Branch bars
  const branchCounts = {};
  for (const s of students) {
    const key = s.branch || 'Unknown';
    branchCounts[key] = (branchCounts[key] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(branchCounts), 1);
  const barColors = ['#F5C518','#00C9A7','#845EF7','#339AF0','#FF6B6B','#F06595','#FF922B','#20C997'];
  const barsEl = document.getElementById('branchBars');

  if (!Object.keys(branchCounts).length) {
    barsEl.innerHTML = '<div class="empty-state-sm">No branch data</div>';
  } else {
    const sorted = Object.entries(branchCounts).sort((a,b) => b[1]-a[1]).slice(0, 8);
    barsEl.innerHTML = sorted.map(([branch, count], i) => `
      <div class="branch-bar-item">
        <div class="branch-bar-label">
          <strong>${branch}</strong>
          <span>${count} student${count !== 1 ? 's' : ''}</span>
        </div>
        <div class="branch-bar-track">
          <div class="branch-bar-fill bar-${i}" style="width:${Math.round(count/maxCount*100)}%"></div>
        </div>
      </div>
    `).join('');
  }
}