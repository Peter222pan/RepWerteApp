const values = ["Mut", "Weitsicht", "Vertrauen"];

const questionsByValue = {
  Mut: [
    "Wo haben Sie diese Woche eine mutige Entscheidung getroffen – und was haben Sie daraus gelernt?",
    "Bei welchem Thema hätten Sie noch mutiger handeln können?",
    "Wie haben Sie Ihr Team ermutigt, kalkulierte Risiken einzugehen?"
  ],
  Weitsicht: [
    "Welche Entscheidung von heute stärkt die Zusammenarbeit in den nächsten 6 Monaten?",
    "Welche langfristigen Folgen haben Ihre Prioritäten dieser Woche?",
    "Wie haben Sie kommende Herausforderungen frühzeitig adressiert?"
  ],
  Vertrauen: [
    "Wie haben Sie diese Woche aktiv Vertrauen in Ihrem Team aufgebaut?",
    "Wo haben Sie Verantwortung bewusst delegiert und Vertrauen gezeigt?",
    "Wie transparent war Ihre Kommunikation in einer schwierigen Situation?"
  ]
};

const weekLabel = document.getElementById("week-label");
const valueLabel = document.getElementById("value-label");
const questionText = document.getElementById("question-text");
const form = document.getElementById("reflection-form");
const reflectionInput = document.getElementById("reflection-input");
const feedbackEl = document.getElementById("feedback");

function getISOWeek(date = new Date()) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const diff = target - firstThursday;
  return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
}

function mondayOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const distance = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + distance);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeeklyQuestion(date = new Date()) {
  const week = getISOWeek(date);
  const value = values[(week - 1) % values.length];
  const questions = questionsByValue[value];
  const question = questions[(week - 1) % questions.length];
  return { week, value, question };
}

function storageKey(date = new Date()) {
  return `reflection-${mondayOfWeek(date).toISOString().slice(0, 10)}`;
}

function feedbackText(reflection, value) {
  const lower = reflection.toLowerCase();
  const hasAction = /ich habe|wir haben|umgesetzt|entschieden|geklärt/.test(lower);
  const hasImpact = /wirkung|ergebnis|team|zusammenarbeit|nutzen/.test(lower);

  if (hasAction && hasImpact) {
    return `Stark: Ihre Reflexion zeigt konkrete Handlungen und Wirkung zum Wert «${value}». Überlegen Sie als nächsten Schritt, was Sie nächste Woche bewusst beibehalten möchten.`;
  }

  return `Danke für Ihre Reflexion zum Wert «${value}». Für noch mehr Tiefgang: Beschreiben Sie eine konkrete Handlung und deren Wirkung auf Ihr Team.`;
}

function loadWeeklyData() {
  const { week, value, question } = getWeeklyQuestion(new Date());
  weekLabel.textContent = `${week}`;
  valueLabel.textContent = value;
  questionText.textContent = question;

  const savedReflection = localStorage.getItem(storageKey(new Date()));
  if (savedReflection) {
    reflectionInput.value = savedReflection;
    feedbackEl.textContent = feedbackText(savedReflection, value);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const reflection = reflectionInput.value.trim();

  if (reflection.length < 20) {
    feedbackEl.textContent = "Bitte schreiben Sie mindestens 20 Zeichen für eine hilfreiche Reflexion.";
    reflectionInput.focus();
    return;
  }

  const { value } = getWeeklyQuestion(new Date());
  localStorage.setItem(storageKey(new Date()), reflection);
  feedbackEl.textContent = feedbackText(reflection, value);
});

loadWeeklyData();
