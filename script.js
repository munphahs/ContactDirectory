// ===============================
// 🔤 Utility: Capitalize Name
// ===============================
function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// ===============================
// 🧠 Faculty Grouping Function (Multi-Group Support)
// ===============================
function getFacultySubGroup(contact) {
  const title = contact.positionType?.toLowerCase() || "";
  const area = contact.subdivision?.toLowerCase() || "";
  const groups = [];

  if (title.startsWith("associate dean")) groups.push("Associate Dean");
  if (title.startsWith("assistant professor")) groups.push("Assistant Professor");
  if (title.startsWith("associate professor")) groups.push("Associate Professor");
  if (
    title.startsWith("professor") &&
    !title.startsWith("assistant") &&
    !title.startsWith("associate")
  ) {
    groups.push("Professor");
  }

  if (title.includes("clinical epidemiology") || area.includes("clinical epidemiology")) {
    groups.push("Clinical Epidemiology");
  }

  if (title.includes("ethics") || area.includes("ethics")) {
    groups.push("Ethics");
  }

  if (title.includes("honorary research professor")) {
    groups.push("Honorary Research Professor");
  }

  if (groups.length === 0) {
    groups.push("Other");
  }

  return groups;
}

// ===============================
// 🧠 Master Filter Function
// ===============================
function filterContacts() {
  const department = document.getElementById("departmentFilter").value.toLowerCase();
  const adminSubDept = document.getElementById("adminSubFilter").value.toLowerCase();
  const facultySubDept = document.getElementById("facultySubFilter")?.value.toLowerCase() || "";
  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filtered = contactListData.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const duties = contact.duties?.toLowerCase() || "";
    const area = contact.area?.toLowerCase() || "";
    const title = contact.positionType?.toLowerCase() || "";
    const contactSub = contact.subdepartment?.toLowerCase() || "";
    const facultyGroups = getFacultySubGroup(contact).map(g => g.toLowerCase());

    const matchesFacultySub =
      department !== "faculty" ||
      !facultySubDept ||
      facultyGroups.includes(facultySubDept);

    const matchesSearch = fullName.includes(searchText) || duties.includes(searchText);

    const matchesDept =
      !department ||
      area === department ||
      (department === "ethics" && ["bioethics", "medical ethics"].includes(area)) ||
      (department === "epidemiology" && ["clinical epidemiology", "epidemiology"].includes(area)) ||
      (department === "retired" && title.includes("retired"));

    const matchesAdminSub =
      department !== "administration" || !adminSubDept || contactSub === adminSubDept;

    return matchesSearch && matchesDept && matchesAdminSub && matchesFacultySub;
  });

  renderContacts(filtered);
}

// ===============================
// 🧱 Card Rendering Logic
// ===============================
function getImageSrc(fullName) {
  return `images/${fullName.replace(/\s+/g, '-').toLowerCase()}.jpg`;
}

function createContactCard(person) {
  const fullName = `${formatName(person.firstName)} ${formatName(person.lastName)}`;
  const email = person.email.split(";")[0].trim();
  const phone = person.ext ? `(709) ${person.ext}` : "N/A";
  const imgSrc = getImageSrc(fullName);
  const dutiesText = (window.dutiesMap?.[fullName] || []).join(" ").toLowerCase();

  const nameHTML = person.area !== "Administration"
    ? `<a href="${person.profileUrl || `profiles/${fullName.replace(/\s+/g, '-').toLowerCase()}.html`}" class="profile-link" target="_blank">${fullName}</a>`
    : fullName;

  return `
    <div class="contact-card"
         data-name="${fullName.toLowerCase()}"
         data-department="${person.area.toLowerCase()}"
         data-duties="${dutiesText}">
      <img src="${imgSrc}" alt="${fullName}" class="contact-photo"
           onerror="this.onerror=null; this.src='images/default-avatar.jpg'" />

      <div class="contact-info">
        <h2>${nameHTML}</h2>
        <p><strong>Title:</strong> ${person.positionType}</p>
        <p><i class="fas fa-envelope"></i> <a href="mailto:${email}">${email}</a></p>
        <p><i class="fas fa-phone"></i> ${phone}</p>
        <p><i class="fas fa-map-marker-alt"></i> ${person.office || "N/A"}</p>
        ${
          person.area === "Administration"
            ? `<p><a href="#" class="duties-link" data-name="${fullName}" data-email="${email}" onclick="openFlashcard(this)">View Duties & Responsibilities</a></p>`
            : ""
        }
      </div>
    </div>
  `;
}

function renderContacts(data) {
  const container = document.getElementById("contactListContainer");
  container.innerHTML = data.map(createContactCard).join("");
}

// ===============================
// 💬 Flashcard Modal Logic
// ===============================
function openFlashcard(el) {
  const name = el.dataset.name;
  const email = el.dataset.email;

  const modal = document.getElementById("flashcardModal");
  const card = document.getElementById("flashcardCard");
  const nameElement = document.getElementById("flashcardName");
  const emailElement = document.getElementById("flashcardEmail");
  const dutiesList = document.getElementById("dutiesList");

  nameElement.textContent = name;
  emailElement.textContent = email;

  // Get duties for the selected name (case-insensitive match)
  const duties = window.dutiesMap?.[name] || ["Duties not assigned"];

  // Clear previous list
  dutiesList.innerHTML = "";

  duties.forEach(duty => {
    const listItem = document.createElement('li');

    // Check if this duty includes an associated file
    if (duty.startsWith("Associated files")) {
      // Match: "Associated files : Travel Claim- https://example.com/file.xlsx"
      const regex = /Associated files\s*:\s*([^-\n]+)-\s*(https?:\/\/[^\s]+)/;
      const match = duty.match(regex);

      if (match) {
        const label = match[1].trim(); // e.g., "Travel Claim"
        const url = match[2].trim();   // e.g., "https://example.com/file.xlsx"

        const link = document.createElement('a');
        link.href = url;
        link.textContent = `${label} (Download)`;  // Corrected string interpolation
        link.target = '_blank'; // Open in new tab
        link.rel = 'noopener noreferrer';

        listItem.appendChild(link);
      } else {
        // Fallback: if pattern doesn't match exactly, show raw text
        listItem.textContent = duty;
      }
    } else {
      // Regular duty line
      listItem.textContent = duty;
    }

    dutiesList.appendChild(listItem);
  });

  // Show the modal
  card.classList.remove("flipped");
  modal.classList.add("show");
}

function flipCard() {
  document.getElementById("flashcardCard").classList.toggle("flipped");
}

function closeFlashcard() {
  document.getElementById("flashcardModal").classList.remove("show");
}

// Optional: close flashcard if user clicks outside of it
document.addEventListener("click", function (e) {
  const modal = document.getElementById("flashcardModal");
  const card = document.getElementById("flashcardCard");

  // If modal is not visible, do nothing
  if (!modal.classList.contains("show")) return;

  // If click is outside of card and not on duties link, close the modal
  if (!card.contains(e.target) && !e.target.classList.contains("duties-link")) {
    closeFlashcard();
  }
});







// ===============================
// 🎛️ Filter Initialization
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  contactListData.sort((a, b) =>
    a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase())
  );

  renderContacts(contactListData);

  const deptSelect = document.getElementById("departmentFilter");
  const adminSub = document.getElementById("adminSubFilter");
  const facultySub = document.getElementById("facultySubFilter");
  const searchInput = document.getElementById("searchInput");

  deptSelect.addEventListener("change", () => {
    const dept = deptSelect.value;
    adminSub.style.display = dept === "Administration" ? "inline-block" : "none";
    facultySub.style.display = dept === "Faculty" ? "inline-block" : "none";
    if (dept !== "Administration") adminSub.selectedIndex = 0;
    if (dept !== "Faculty") facultySub.selectedIndex = 0;
    filterContacts();
  });

  adminSub.addEventListener("change", filterContacts);
  facultySub.addEventListener("change", filterContacts);
  searchInput.addEventListener("input", filterContacts);
});