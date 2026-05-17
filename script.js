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

async function deletePaper(filename){

const password=prompt(
"Enter Admin Password"
);

if(!password)return;

const response=await fetch(
"/api/delete",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
filename,
password
})

}
);

const data=await response.json();

alert(data.message);

if(response.ok){

loadPapers();

}

}