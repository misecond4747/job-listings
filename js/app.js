let container = document.querySelector(".container");
let jobData = [];
let filteredData = [];

// Fetch and store data
async function fetchData() {
  try {
    let response = await fetch("../data.json");
    jobData = await response.json();
    filteredData = [...jobData]; // Initialize filteredData with all jobData
    renderJobs(filteredData);
  } catch (error) {
    console.error("Error while fetching data:", error);
  }
}

fetchData();

// Render jobs based on filtered data
function renderJobs(data) {
  container.innerHTML = data
    .map((item) => {
      let {
        id,
        company,
        logo,
        new: isNew,
        featured,
        position,
        role,
        level,
        postedAt,
        contract,
        location,
        languages,
        tools,
      } = item;

      return `<div class="job ${isNew && featured ? "isActive" : ""}">
      <div class="profile">
        <div class="profileImg">
          <img src="${logo}" alt="profile" role="img" />
        </div>
        <div class="info">
          <div class="topSubtitle">
            <span>${company}</span>
            ${isNew ? `<span> New!</span>` : ""}
            ${featured ? `<span> Featured</span>` : ""}
          </div>
          <h1 class="title"><strong> ${position}</strong></h1>
          <div class="bottomSubtitle">
            <span>${postedAt} .</span>
            <span>${contract} .</span>
            <span>${location}</span>
          </div>
        </div>
      </div>
      <ul class="role" role="list">
        <li class="roleList">${role}</li>
        <li class="roleList">${level}</li>
        ${languages
          .map((element) => `<li class="roleList">${element}</li>`)
          .join("")}
        ${tools
          .map((element) => `<li class="roleList">${element}</li>`)
          .join("")}
      </ul>
    </div>`;
    })
    .join("");
  addFilterEventListeners();
}

function addFilterEventListeners() {
  const roleList = document.querySelectorAll(".roleList");
  roleList.forEach((el) => {
    el.addEventListener("click", (e) => {
      filterJobs(e.target.innerText);
    });
  });
}

function filterJobs(role) {
  const filterBox = document.querySelector(".filterBox");
  const filter = document.querySelector(".filter");

  // Create button elements
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");

  const filterButton = document.createElement("button");
  filterButton.classList.add("filterButton");
  filterButton.textContent = role;

  const crossButton = document.createElement("button");
  crossButton.classList.add("crossButton");
  crossButton.addEventListener("click", () => {
    buttonContainer.remove();
    updateFilteredJobs();
  });

  const clearButton = document.createElement("button");
  clearButton.classList.add("clearBtn");
  clearButton.textContent = "Clear";
  clearButton.addEventListener("click", () => {
    clearFilter();
  });

  const crossImg = document.createElement("img");
  crossImg.src = "../images/icon-remove.svg";
  crossImg.alt = "remove";
  crossImg.classList.add("crossImg");

  crossButton.appendChild(crossImg);
  buttonContainer.appendChild(filterButton);
  buttonContainer.appendChild(crossButton);

  // Check if the button already exists
  const existingButtons = filterBox.querySelectorAll(".filterButton");
  for (const btn of existingButtons) {
    if (btn.textContent === role) {
      return alert("Already selected");
    }
  }

  filterBox.appendChild(buttonContainer);
  filterBox.appendChild(clearButton);
  updateFilteredJobs();
}

function updateFilteredJobs() {
  const filterBox = document.querySelector(".filterBox");
  const filter = document.querySelector(".filter");
  const activeFilters = Array.from(
    document.querySelectorAll(".filterButton")
  ).map((btn) => btn.textContent);

  if (activeFilters.length === 0) {
    filter.classList.remove("activeFilterBox");
    filteredData = [...jobData]; // Show all job data
  } else {
    filter.classList.add("activeFilterBox");

    filteredData = jobData.filter((item) => {
      // Check if the item matches all active filters
      return activeFilters.every(
        (filter) =>
          item.role === filter ||
          item.level === filter ||
          item.languages.includes(filter) ||
          item.tools.includes(filter)
      );
    });
  }

  renderJobs(filteredData);
}

const clearFilter = () => {
  const filterBox = document.querySelector(".filterBox");
  const filter = document.querySelector(".filter");
  filterBox.innerHTML = "";
  filter.classList.remove("activeFilterBox");
  filteredData = [...jobData]; // Show all job data
  renderJobs(filteredData);
};

// Initialize event listeners and UI
document.addEventListener("DOMContentLoaded", () => {
  fetchData(); // Load data initially
});
