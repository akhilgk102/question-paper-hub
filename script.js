async function uploadPDF() {
  let file = document.getElementById("pdf").files[0];
  if (!file) { alert("Select PDF"); return; }

  let category   = document.getElementById("category").value;
  let university = document.getElementById("university").value;
  let course     = document.getElementById("course").value;
  let semester   = document.getElementById("semester").value;
  let year       = document.getElementById("year").value;
  let subject    = document.getElementById("subject").value.trim();

  if (!subject) { alert("Enter subject name"); return; }

  let response = await fetch("/api/upload", {
    method: "POST",
    headers: { category, university, course, semester, subject, year },
    body: file
  });

  let data = await response.json();
  document.getElementById("msg").innerHTML = data.message;
}

async function loadPapers() {
  const papers = document.getElementById("papers");
  papers.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Fetching papers…</p>
    </div>`;

  try {
    const response = await fetch(
      "https://api.github.com/repos/akhilgk102/question-paper-hub/contents/pdf"
    );
    const files = await response.json();

    const universityMap = {
      "Kerala University":  "KU",
      "MG University":      "MGU",
      "Calicut University": "CU",
      "Kannur University":  "KNU"
    };
    const courseMap = {
      "BSc Computer Science": "BSC-CS",
      "BCA":  "BCA",
      "BCom": "BCOM",
      "BBA":  "BBA"
    };

    let university = universityMap[document.getElementById("university").value] || "";
    let course     = courseMap[document.getElementById("course").value] || "";
    let semester   = document.getElementById("semester").value.replace("Sem ", "S");
    let year       = document.getElementById("year").value;

    const filtered = files.filter(file => {
      const name = file.name.toUpperCase();
      return (
        (!university || name.includes(university)) &&
        (!course     || name.includes(course))     &&
        (!semester   || name.includes(semester))   &&
        (!year       || name.includes(year))
      );
    });

    papers.innerHTML = "";

    if (filtered.length === 0) {
    papers.innerHTML = `
    <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No papers found</p>
        <span>Try adjusting your filters above</span>
        <div class="empty-hint">refine your search</div>
    </div>`;
      return;
    }

    papers.innerHTML = `<span class="results-label">${filtered.length} paper${filtered.length !== 1 ? "s" : ""} found</span>`;

    const grid = document.createElement("div");
    grid.className = "papers-grid";
    papers.appendChild(grid);

    filtered.forEach((file, index) => {
      const parts   = file.name.replace(/\.pdf$/i, "").split("_");
      const viewUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(file.download_url)}`;

      // Badge label = uni + course  (e.g.  "KU · BCA")
      const badgeText = [parts[0], parts[1]].filter(Boolean).join(" · ");

      const card = document.createElement("div");
      card.className = "pdf-card";
      card.style.animationDelay = `${index * 90}ms`;

card.innerHTML = `
  <div class="pdf-embed-wrap">
    ${badgeText ? `<div class="pdf-card-badge">${badgeText}</div>` : ""}
    <div class="pdf-loader">
      <div class="pdf-loader-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="13" x2="15" y2="13"/>
          <line x1="9" y1="17" x2="13" y2="17"/>
        </svg>
      </div>
      <div class="spinner-sm"></div>
      <span>Loading preview…</span>
    </div>
    <iframe
      src="${viewUrl}"
      title="${file.name}"
      allowfullscreen
      loading="lazy"
      onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';"
    ></iframe>
    <a href="${viewUrl}" class="pdf-fullscreen-btn" target="_blank" title="Open fullscreen">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
      </svg>
    </a>
  </div>

  <div class="pdf-card-body">
    <p class="pdf-card-name" title="${file.name}">
      ${file.name.replace(".pdf","").replaceAll("_"," ")}
    </p>
    <div class="pdf-card-tags">
      ${parts[0] ? `<span class="tag tag-uni">${parts[0]}</span>` : ""}
      ${parts[1] ? `<span class="tag tag-course">${parts[1]}</span>` : ""}
      ${parts[2] ? `<span class="tag tag-sem">${parts[2]}</span>` : ""}
      ${parts[3] ? `<span class="tag tag-year">${parts[3]}</span>` : ""}
      ${parts[4] ? `<span class="tag tag-sub">${parts.slice(4).join(" ")}</span>` : ""}
    </div>
  </div>

  <div class="pdf-card-footer">
    <a href="${file.download_url}" download class="btn-action btn-download">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
           stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 13 7 8"/>
        <line x1="12" y1="3" x2="12" y2="13"/>
      </svg>
      Download
    </a>
    <button class="btn-action btn-delete" onclick="deletePaper('${file.name}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
           stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
      
    </button>
  </div>
`;

      grid.appendChild(card);
    });

  } catch (error) {
    console.error(error);
papers.innerHTML = `
  <div class="empty-state">
    <div class="empty-icon">⚠️</div>
    <p>Something went wrong</p>
    <span>Check your connection and try again</span>
    <div class="empty-hint">reload the page</div>
  </div>`;
  }
}



function showDeleteModal(filename) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: fadeIn 0.15s ease;
    `;

    overlay.innerHTML = `
      <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .del-modal {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 28px 24px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.30);
          animation: slideUp 0.2s cubic-bezier(.22,.68,0,1.2) both;
        }
        .del-modal-icon {
          width: 48px; height: 48px;
          background: #fff0f0;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .del-modal-icon svg { width: 22px; height: 22px; stroke: #d32f2f; }
        .del-modal h3 {
          font-size: 17px; font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .del-modal p {
          font-size: 13px; color: var(--text-secondary);
          margin-bottom: 20px; line-height: 1.5;
        }
        .del-modal-file {
          font-size: 11px; font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 10px;
          margin-bottom: 20px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .del-modal input {
          width: 100%;
          padding: 11px 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          margin-bottom: 16px;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .del-modal input:focus {
          border-color: #d32f2f;
          box-shadow: 0 0 0 3px rgba(211,47,47,0.12);
        }
        .del-modal input::placeholder { color: var(--text-muted); }
        .del-modal-btns {
          display: flex; gap: 8px;
        }
        .del-btn-cancel {
          flex: 1; height: 40px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 13px; font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }
        .del-btn-cancel:hover { background: var(--border); }
        .del-btn-confirm {
          flex: 1; height: 40px;
          background: #d32f2f;
          border: none;
          border-radius: 10px;
          font-size: 13px; font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .del-btn-confirm:hover { background: #b71c1c; }
        .del-btn-confirm:active { transform: scale(0.97); }
        .del-btn-confirm svg { width: 14px; height: 14px; stroke: #fff; }
      </style>

      <div class="del-modal">
        <div class="del-modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3>Delete Paper</h3>
        <p>This action cannot be undone. Enter the admin password to confirm.</p>
        <div class="del-modal-file">${filename}</div>
        <input type="password" id="del-password-input" placeholder="Admin password" autocomplete="off" />
        <div class="del-modal-btns">
          <button class="del-btn-cancel" id="del-cancel">Cancel</button>
          <button class="del-btn-confirm" id="del-confirm">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector("#del-password-input");
    const cancelBtn = overlay.querySelector("#del-cancel");
    const confirmBtn = overlay.querySelector("#del-confirm");

    setTimeout(() => input.focus(), 100);

    const close = (value) => {
      overlay.remove();
      resolve(value);
    };

    cancelBtn.addEventListener("click", () => close(null));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(null); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") confirmBtn.click();
      if (e.key === "Escape") close(null);
    });
    confirmBtn.addEventListener("click", () => {
      const val = input.value.trim();
      if (!val) { input.focus(); input.style.borderColor = "#d32f2f"; return; }
      close(val);
    });
  });
}

async function deletePaper(filename) {
  const password = await showDeleteModal(filename);
  if (!password) return;

  const response = await fetch("/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, password })
  });

  const data = await response.json();

  if (response.ok) {
    showToast("Deleted successfully", "success");
    loadPapers();
  } else {
    showToast(data.message || "Delete failed", "error");
  }
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    z-index: 99999;
    background: ${type === "success" ? "#1a1816" : "#d32f2f"};
    color: #fff;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 13px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    animation: fadeIn 0.2s ease;
    white-space: nowrap;
  `;
  toast.textContent = type === "success" ? "✓  " + message : "✕  " + message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}