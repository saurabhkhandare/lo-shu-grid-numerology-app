// Lo Shu grid positions (row, col) for numbers 1-9
const gridPositions = {
  1: [2, 0],
  2: [0, 2],
  3: [1, 2],
  4: [2, 1],
  5: [1, 1],
  6: [0, 1],
  7: [2, 2],
  8: [1, 0],
  9: [0, 0],
};

// Standard Lo Shu magic square
const standardLoShu = [
  [9, 6, 2],
  [8, 5, 3],
  [1, 4, 7],
];

// Color mapping for each number (based on numerology/feng shui)
const colorMap = {
  1: "Dark Blue / Black",
  2: "Pink / Red / White",
  3: "Green",
  4: "Green",
  5: "Yellow",
  6: "White",
  7: "Grey",
  8: "Yellow",
  9: "Red",
};

// Short meaning for each number in Lo Shu
const numberMeanings = {
  1: "Leadership, independence, originality.",
  2: "Sensitivity, cooperation, relationships.",
  3: "Creativity, communication, expression.",
  4: "Stability, practicality, discipline.",
  5: "Freedom, adventure, adaptability.",
  6: "Responsibility, nurturing, balance.",
  7: "Spirituality, analysis, wisdom.",
  8: "Power, ambition, material success.",
  9: "Compassion, humanitarianism, completion.",
};

// Description for missing numbers
const missingDesc = {
  1: "Lack of 1: May struggle with self-confidence or initiative.",
  2: "Lack of 2: Challenges in relationships or emotional expression.",
  3: "Lack of 3: Difficulty expressing creativity or emotions.",
  4: "Lack of 4: May lack discipline or stability.",
  5: "Lack of 5: Hesitant to embrace change or adventure.",
  6: "Lack of 6: May avoid responsibility or nurturing roles.",
  7: "Lack of 7: May avoid introspection or spiritual pursuits.",
  8: "Lack of 8: May struggle with ambition or material success.",
  9: "Lack of 9: May lack compassion or global perspective.",
};

// Lucky number and color prediction logic
function getLuckyNumberAndColor(counts) {
  let maxCount = 0,
    luckyNums = [];
  for (let i = 1; i <= 9; i++) {
    if (counts[i] > maxCount) {
      maxCount = counts[i];
      luckyNums = [i];
    } else if (counts[i] === maxCount && maxCount > 0) {
      luckyNums.push(i);
    }
  }
  let luckyNum = luckyNums.length ? Math.min(...luckyNums) : null;
  let favColor = luckyNum ? colorMap[luckyNum] : "N/A";
  return { luckyNum, favColor };
}

// Lo Shu grid builder
function buildLoShuGrid(digits) {
  // Count occurrences of each number 1-9
  let counts = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  digits.forEach((d) => {
    if (d >= 1 && d <= 9) counts[d]++;
  });
  // Build 3x3 grid (each cell can contain multiple digits)
  let grid = Array(3)
    .fill()
    .map(() => Array(3).fill(""));
  for (let n = 1; n <= 9; n++) {
    let [row, col] = gridPositions[n];
    let repeats = counts[n];
    grid[row][col] = repeats ? n.toString().repeat(repeats) : "";
  }
  return { grid, counts };
}

// Numerology: single digit reduction
function reduceToSingleDigit(n) {
  while (n > 9 && n !== 11 && n !== 22) {
    n = n
      .toString()
      .split("")
      .reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

// Render grid as HTML
function renderGrid(grid, highlightMissing = false) {
  let html = '<div class="grid">';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let val = grid[r][c];
      let absent = val === "" && highlightMissing ? "absent" : "";
      html += `<div class="cell ${absent}">${val}</div>`;
    }
  }
  html += "</div>";
  return html;
}

// Render standard Lo Shu grid
function renderStandardGrid() {
  let html = '<div class="grid">';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      html += `<div class="cell">${standardLoShu[r][c]}</div>`;
    }
  }
  html += "</div>";
  return html;
}

// Main handler
document.getElementById("dobForm").onsubmit = function (e) {
  e.preventDefault();
  const dob = document.getElementById("dob").value;
  if (!dob) return;
  // Extract digits
  const digits = dob.replace(/-/g, "").split("").map(Number);
  // Driver (Personality) number: reduce day
  let day = parseInt(dob.split("-")[2], 10);
  let driver = reduceToSingleDigit(day);
  // Conductor (Destiny) number: reduce all digits
  let total = digits.reduce((a, b) => a + b, 0);
  let conductor = reduceToSingleDigit(total);

  // As per your request and standard numerology practice, treat conductor as a normal number and add to digits
  let allDigits = [...digits, conductor];

  // Build personalized grid with conductor included as a normal number
  const { grid, counts } = buildLoShuGrid(allDigits);

  // Find missing numbers
  let missing = [];
  for (let i = 1; i <= 9; i++) if (!counts[i]) missing.push(i);

  // Lucky number and color
  let { luckyNum, favColor } = getLuckyNumberAndColor(counts);

  // Present numbers
  let present = [];
  for (let i = 1; i <= 9; i++) if (counts[i]) present.push(i);

  // Output
  let out = "";

  out += `<div class="desc"><span class="highlight">Your Lo Shu Grid & Full Lo Shu Grid:</span></div>`;
  out += `<div class="grids-flex">
    <div class="grid-section">
      <div class="grid-title">Your Lo Shu Grid</div>
      ${renderGrid(grid, true)}
      <div style="font-size:13px;color:#888;">(Conductor number <b>${conductor}</b> included as a normal number)</div>
    </div>
    <div class="grid-section">
      <div class="grid-title">Full Lo Shu Grid</div>
      ${renderStandardGrid()}
      <div style="font-size:13px;color:#888;">(Standard magic square)</div>
    </div>
  </div>`;

  // Present and Absent numbers
  out += `<div class="desc"><b>Numbers Present:</b> ${
    present.join(", ") || "None"
  }<br>`;
  out += `<b>Numbers Absent:</b> ${missing.join(", ") || "None"}</div>`;

  // Meanings for present numbers
  if (present.length) {
    out += `<div class="desc"><b>Present Number Meanings:</b><ul>`;
    present.forEach((n) => {
      out += `<li><b>${n}:</b> ${numberMeanings[n]}</li>`;
    });
    out += `</ul></div>`;
  }

  // Meanings for missing numbers
  if (missing.length) {
    out += `<div class="desc"><b>Absent Number Insights:</b><ul>`;
    missing.forEach((n) => {
      out += `<li>${missingDesc[n]}</li>`;
    });
    out += `</ul></div>`;
  }

  // Driver and Conductor
  out += `<div class="desc"><b>Driver (Personality) Number:</b> ${driver}<br>`;
  out += `<b>Conductor (Destiny) Number:</b> ${conductor}</div>`;

  // Lucky number and color
  out += `<div class="lucky"><b>Your Lucky Number:</b> ${
    luckyNum || "N/A"
  }<br>`;
  out += `<b>Your Favorite Color (as per numerology):</b> ${favColor}</div>`;

  // Short prediction
  out += `<div class="desc"><b>Prediction:</b> Your Lo Shu Grid reveals your strengths and weaknesses. Focus on developing qualities related to your missing numbers for a more balanced life. Your lucky number and color can be used for important decisions or as a personal talisman.</div>`;

  document.getElementById("output").innerHTML = out;
};
