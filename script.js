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
    let subjectSearch = document
    .getElementById("subjectSearch")
    .value
    .toUpperCase()
    .trim();

    const filtered = files.filter(file => {
      const name = file.name.toUpperCase();
      return (
        (!university || name.includes(university)) &&
        (!course     || name.includes(course))     &&
        (!semester   || name.includes(semester))   &&
        (!year       || name.includes(year)) &&
        (!subjectSearch || name.includes(subjectSearch))
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



              <div data-w-id="041ab7a4-e089-3f49-7f64-3c5266460fb9"
              style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; filter: blur(0px); opacity: 1;"
              class="about-top-btns"><a href="${file.download_url}" data-wf--secondary-btn--variant="model-02"
                data-w-id="eb4e669e-9f8d-20f1-6ed9-b011d824b479"
                class="secondary-btn w-variant-cd52b52e-17f6-4329-bd21-53a7497bb79d w-inline-block">
                <div class="secondary-btn-texts">
                  <div class="secondary-btn-text-inside">
                    <div class="nav-button-text"
                      style="transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
                      Download PDF</div>
                    <div class="nav-button-text"
                      style="transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
                      Download PDF</div>
                  </div>
                </div>
                <div class="secondary-btn-icon-outside w-variant-cd52b52e-17f6-4329-bd21-53a7497bb79d">
                  <div class="secondary-btn-icons">
                    <div class="secondary-btn-icon-inside"
                      style="transform: translate3d(-16px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;">
                      <div class="nav-btn-ico w-embed"><svg width="100%" height="100%" viewBox="0 0 17 15" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M7.08594 15L13.5859 8.5L5.68248e-07 8.5L7.43094e-07 6.5L13.5859 6.5L7.08594 -8.41103e-07L9.91406 -5.9386e-07L16.707 6.79297L16.707 8.20703L9.91406 15L7.08594 15Z"
                            fill="currentColor"></path>
                        </svg></div>
                      <div class="nav-btn-ico w-embed"><svg width="100%" height="100%" viewBox="0 0 17 15" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M7.08594 15L13.5859 8.5L5.68248e-07 8.5L7.43094e-07 6.5L13.5859 6.5L7.08594 -8.41103e-07L9.91406 -5.9386e-07L16.707 6.79297L16.707 8.20703L9.91406 15L7.08594 15Z"
                            fill="currentColor"></path>
                        </svg></div>
                    </div>
                  </div>
                </div>
              </a></div>


              

              
    
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
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
    `;

    overlay.innerHTML = `
      <style>
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .del-modal {
          background: #112522;
          border: 1px solid #1f2e2c;
          border-radius: 20px;
          padding: 28px 28px 24px;
          width: 100%; max-width: 400px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
          animation: slideUp 0.22s cubic-bezier(.22,.68,0,1.2) both;
          font-family: 'DM Sans', sans-serif;
        }
        .del-modal-icon {
          width: 48px; height: 48px;
          background: rgba(211,47,47,0.12);
          border: 1px solid rgba(211,47,47,0.25);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .del-modal-icon svg { width: 22px; height: 22px; stroke: #f06060; }
        .del-modal h3 {
          font-size: 17px; font-weight: 600;
          color: #ffffff; margin-bottom: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .del-modal p {
          font-size: 13px; color: #5f6d6b;
          margin-bottom: 16px; line-height: 1.6;
          font-family: 'DM Sans', sans-serif;
        }
        .del-modal-file {
          font-size: 11px; font-weight: 600;
          color: #93afaa;
          background: #050c0b;
          border: 1px solid #1f2e2c;
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 16px;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .del-modal input {
          width: 100%;
          padding: 11px 14px;
          background: #050c0b;
          border: 1px solid #1f2e2c;
          border-radius: 10px;
          font-size: 14px;
          color: #ffffff;
          outline: none;
          margin-bottom: 16px;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }
        .del-modal input:focus {
          border-color: rgba(240,96,96,0.5);
          box-shadow: 0 0 0 3px rgba(211,47,47,0.12);
        }
        .del-modal input::placeholder { color: #3a4a48; }
        .del-modal-btns { display: flex; gap: 8px; }
        .del-btn-cancel {
          flex: 1; height: 42px;
          background: #050c0b;
          border: 1px solid #1f2e2c;
          border-radius: 10px;
          font-size: 13px; font-weight: 500;
          color: #5f6d6b; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, color 0.15s;
        }
        .del-btn-cancel:hover { background: #1f2e2c; color: #ffffff; }
        .del-btn-confirm {
          flex: 1; height: 42px;
          background: #c62828;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          color: #fff; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: background 0.15s, transform 0.1s;
        }
        .del-btn-confirm:hover { background: #b71c1c; }
        .del-btn-confirm:active { transform: scale(0.97); }
        .del-btn-confirm svg { width: 14px; height: 14px; stroke: #fff; flex-shrink:0; }
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

    const input     = overlay.querySelector("#del-password-input");
    const cancelBtn = overlay.querySelector("#del-cancel");
    const confirmBtn = overlay.querySelector("#del-confirm");

    setTimeout(() => input.focus(), 100);

    const close = (value) => { overlay.remove(); resolve(value); };

    cancelBtn.addEventListener("click", () => close(null));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(null); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter")  confirmBtn.click();
      if (e.key === "Escape") close(null);
    });
    confirmBtn.addEventListener("click", () => {
      const val = input.value.trim();
      if (!val) { input.focus(); input.style.borderColor = "#f06060"; return; }
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