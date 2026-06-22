

/* =========================================================
   PEOPLEIQ TOPIC PAGE LOADER
   CONFIG
   ========================================================= */

const piqContainer = document.getElementById("piq-topic-page");

if (!piqContainer) {
  throw new Error("PIQ container #piq-topic-page not found.");
}

const PIQ_CONFIG = {
  SLUG: piqContainer.dataset.slug,
  CONTENT_API_URL: "https://script.google.com/macros/s/AKfycbyeCp9WTR09h2M9GDhkI2EXQw4yqrc_wKunOpDxW8l9WFS6UbYgaFJxXWFOxzjlUeE/exec",
  SURVEY_REPOSITORY_URL: "https://raw.githubusercontent.com/PaddyGee8/PIQ-Data/main/peopleiq_survey_master_repository_v1.1.0_RELEASE.json",
  SURVEY_ENDPOINT: "https://script.google.com/macros/s/AKfycbzkZtFOh-P7sMdmIGcaHCpzWKINZ_2XQgbJzWT29EJ95NJLkLz_pN33gEdNN7r9Cbkl_A/exec"
};

if (!PIQ_CONFIG.SLUG) {
  throw new Error("Missing data-slug attribute on #piq-topic-page.");
}

/* =========================================================
   GLOBAL STATE
   ========================================================= */

let piqQuestions = [];
let piqRepositoryVersion = "";
let piqCurrentTopic = null;

const piqScale = [
  { value: 5, label: "Stimme voll zu" },
  { value: 4, label: "Stimme eher zu" },
  { value: 3, label: "Neutral / weiß nicht" },
  { value: 2, label: "Stimme eher nicht zu" },
  { value: 1, label: "Stimme gar nicht zu" }
];

const piqSessionId =
  "piq_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10);

/* =========================================================
   SETTINGS / DESIGN TOKENS
   Reads style_settings from Google Sheets and maps them
   to CSS variables.
   ========================================================= */

function applySettings(settings) {
  if (!settings) return;

  const root = document.documentElement;

  const map = {
    primary_color: "--piq-primary-color",
    primary_hover_color: "--piq-primary-hover-color",
    secondary_color: "--piq-secondary-color",
    background_color: "--piq-background-color",
    surface_color: "--piq-surface-color",
    text_color: "--piq-text-color",
    text_muted_color: "--piq-text-muted-color",
    border_color: "--piq-border-color",

    button_radius: "--piq-button-radius",
    button_padding: "--piq-button-padding",
    button_font_weight: "--piq-button-font-weight",

    card_radius: "--piq-card-radius",
    card_padding: "--piq-card-padding",
    card_shadow: "--piq-card-shadow",

    font_family: "--piq-font-family",
    h1_font_size: "--piq-h1-font-size",
    h1_mobile_font_size: "--piq-h1-mobile-font-size",
    body_font_size: "--piq-body-font-size",

    max_content_width: "--piq-max-content-width",
    intro_width: "--piq-intro-width",
    survey_width: "--piq-survey-width",
    article_width: "--piq-article-width",
    about_width: "--piq-about-width",
    section_spacing: "--piq-section-spacing",

    survey_question_background: "--piq-survey-question-background",

    hero_min_height: "--piq-hero-min-height",
    hero_mobile_min_height: "--piq-hero-mobile-min-height",
    hero_overlay_opacity: "--piq-hero-overlay-opacity",
    hero_content_width: "--piq-hero-content-width",
    hero_content_padding: "--piq-hero-content-padding",
    hero_mobile_content_padding: "--piq-hero-mobile-content-padding",
    hero_text_max_width: "--piq-hero-text-max-width",
    hero_headline_max_width: "--piq-hero-headline-max-width",
    hero_background_position: "--piq-hero-background-position",
    hero_kicker_font_size: "--piq-hero-kicker-font-size",
    hero_kicker_transform: "--piq-hero-kicker-transform",

  faq_card_padding: "--piq-faq-card-padding",
  faq_question_font_size: "--piq-faq-question-font-size",
  faq_answer_font_size: "--piq-faq-answer-font-size",
  faq_spacing: "--piq-faq-spacing",
  };

  Object.keys(map).forEach(key => {
    if (settings[key] !== undefined && settings[key] !== "") {
      root.style.setProperty(map[key], settings[key]);
    }
  });
}

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatText(text) {
  return String(text || "")
    .split("\n")
    .filter(p => p.trim())
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join("");
}

/* =========================================================
   MAIN PAGE RENDERER
   Controls the order of all modules.
   To remove Hero, delete ${renderHero(topic)} below.
   To move FAQs up, move ${renderFaqs(faqs)} above another module.
   ========================================================= */

function renderPage(data) {
  if (!data.found) throw new Error("Page not found");

  applySettings(data.settings || {});

  const topic = data.page.page || {};
  const article = data.page.article || {};
  const siteContent = data.site_content || {};
  const relatedTopics = data.page.related_topics || [];
  const faqs = data.page.faqs || [];
  const references = data.page.references || [];

  piqCurrentTopic = topic;

  const container = document.getElementById("piq-topic-page");

  container.innerHTML = `
    ${renderHero(topic)}
    ${renderIntro(topic)}
    ${renderSurveyShell(topic)}
    ${renderRelatedSection(relatedTopics)}
    ${renderArticle(article, references)}
    ${renderAboutPeopleIQ(siteContent)}
    ${renderFaqs(faqs)}
  `;

  loadSurvey(topic);
}

/* =========================================================
   MODULE: Hero
   Can be removed if Hero is manually built in WordPress.
   ========================================================= */

function renderHero(topic) {
  return `
    <section class="piq-hero" style="background-image:url('${escapeHtml(topic.hero_image_url || "")}')" aria-label="${escapeHtml(topic.hero_image_alt || "")}">
      <div class="piq-hero-overlay">
        <div class="piq-hero-content">
          <p class="piq-hero-kicker">${escapeHtml(topic.display_name || "")}</p>
          <h1>${escapeHtml(topic.hero_headline || topic.h1_title || "")}</h1>
          <p>${escapeHtml(topic.hero_subheadline || "")}</p>
          <a class="piq-button" href="#piq-survey">${escapeHtml(topic.hero_cta_text || "Meinung abgeben")}</a>
        </div>
      </div>
    </section>
  `;
}

/* =========================================================
   MODULE: Intro
   First text block below the Hero.
   Width controlled by intro_width in style_settings.
   ========================================================= */

function renderIntro(topic) {
  return `
    <section class="piq-section piq-intro-section">
      <h1>${escapeHtml(topic.h1_title || topic.display_name || "")}</h1>
      <p>${escapeHtml(topic.intro_text || "")}</p>
      <p><a href="#piq-long-content">Mehr zum Thema lesen ↓</a></p>
    </section>
  `;
}

/* =========================================================
   MODULE: Survey Shell
   Creates the survey wrapper. Questions are loaded separately
   from the GitHub Survey Repository.
   ========================================================= */

function renderSurveyShell(topic) {
  return `
    <section id="piq-survey" class="piq-section piq-survey-section">
      <div class="piq-card">
        <h2>${escapeHtml(topic.survey_headline || "Deine Meinung")}</h2>
        <p class="piq-muted">${escapeHtml(topic.survey_intro || "")}</p>

        <div id="piq-survey-loading">Fragen werden geladen...</div>
        <div id="piq-survey-progress" class="piq-survey-floating-progress"></div>
        <form id="piq-survey-form"></form>
        <button id="piq-survey-submit" class="piq-button" type="button" style="display:none;">Antworten absenden</button>
        <p id="piq-survey-message"></p>
      </div>
    </section>
  `;
}

/* =========================================================
   MODULE: Related Topics
   Uses related_topics array from Content API.
   ========================================================= */

function renderRelatedSection(relatedTopics) {
  return `
    <section class="piq-section">
      <h2>Ähnliche Themen und Umfragen</h2>
      <div class="piq-related-grid">
        ${renderRelatedCards(relatedTopics)}
      </div>
    </section>
  `;
}

function renderRelatedCards(relatedTopics) {
  if (!relatedTopics || !relatedTopics.length) {
    return `<p class="piq-muted">Keine ähnlichen Themen gefunden.</p>`;
  }

  return relatedTopics
    .map(t => `
      <a class="piq-card piq-related-card" href="/${escapeHtml(t.slug || "")}/">
        <h3>${escapeHtml(t.display_name || t.topic_id || "")}</h3>
        <p class="piq-muted">${escapeHtml(t.short_description || "Weitere Umfrage entdecken")}</p>
      </a>
    `)
    .join("");
}

/* =========================================================
   MODULE: Article
   Long-form content from topic_articles.
   Width controlled by article_width in style_settings.
   ========================================================= */

function renderArticle(article, references) {
  return `
    <section id="piq-long-content" class="piq-section piq-article">
      <h2>${escapeHtml(article.long_content_headline || "Mehr Informationen zum Thema")}</h2>
      ${formatText(article.article_body)}
      ${renderReferences(references)}
    </section>
  `;
}


function renderReferences(references) {
  if (!references || !references.length) return "";

  return `
    <div class="piq-references">
      <h3>Quellen und weiterführende Informationen</h3>

      <ul>
        ${references.map(ref => `
          <li>
            <a href="${escapeHtml(ref.url || "")}" target="_blank" rel="noopener">
              ${escapeHtml(ref.source || "")} · ${escapeHtml(ref.title || "")} ↗
            </a>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}


/* =========================================================
   MODULE: Why PeopleIQ
   Dynamic from site_content tab.
   Width controlled by about_width in style_settings.
   ========================================================= */

function renderAboutPeopleIQ(siteContent) {
  const title = siteContent.about_peopleiq_title || "Warum peopleIQ";
  const text = siteContent.about_peopleiq_text || "";
  const cta = siteContent.about_peopleiq_cta || "";

  if (!text) return "";

  return `
    <section class="piq-section piq-about">
      <div class="piq-about-content">
        <h2>${escapeHtml(title)}</h2>
        ${formatText(text)}
        ${cta ? `<a class="piq-button" href="/ueber-peopleiq/">${escapeHtml(cta)}</a>` : ""}
      </div>
    </section>
  `;
}

/* =========================================================
   MODULE: FAQs
   Dynamic from faq_content tab.
   ========================================================= */

function renderFaqs(faqs) {
  if (!faqs || !faqs.length) return "";

  return `
    <section class="piq-section">
      <h2>Häufige Fragen</h2>
      ${faqs.map(faq => `
        <div class="piq-card piq-faq-card">
  <h3 class="piq-faq-question">
    ${escapeHtml(faq.question || "")}
  </h3>

  <p class="piq-faq-answer">
    ${escapeHtml(faq.answer || "")}
  </p>
</div>
      `).join("")}
    </section>
  `;
}

/* =========================================================
   SURVEY: Load questions from GitHub repository
   ========================================================= */

async function loadSurvey(topic) {
  try {
    const response = await fetch(PIQ_CONFIG.SURVEY_REPOSITORY_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Repository konnte nicht geladen werden.");
    }

    const repository = await response.json();

    piqRepositoryVersion = repository.metadata?.repository_version || "";

    piqQuestions = repository.questions.filter(q =>
      q.status === "active" &&
      q.topic_id === topic.topic_id
    );

    if (!piqQuestions.length) {
      document.getElementById("piq-survey-loading").innerText =
        "Für dieses Thema wurden keine aktiven Fragen gefunden.";
      return;
    }

    document.getElementById("piq-survey-loading").style.display = "none";
    renderSurveyQuestions(topic);

  } catch (error) {
    console.error("PIQ SURVEY ERROR:", error);
    document.getElementById("piq-survey-loading").innerText =
      "Die Fragen konnten nicht geladen werden. Bitte versuche es später erneut.";
  }
}

/* =========================================================
   SURVEY: Render questions
   ========================================================= */

function renderSurveyQuestions(topic) {
  const form = document.getElementById("piq-survey-form");
  form.innerHTML = "";

  piqQuestions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "piq-question";

    div.innerHTML = `
      <div class="piq-topic-label">${escapeHtml(topic.display_name || "")} · Frage ${index + 1} von ${piqQuestions.length}</div>
      <h3>${escapeHtml(q.question_text)}</h3>

      <div class="piq-options">
        ${piqScale.map(s => `
          <label>
            <input type="radio" name="${escapeHtml(q.question_id)}" value="${s.value}" data-label="${escapeHtml(s.label)}">
            ${escapeHtml(s.label)}
          </label>
        `).join("")}
      </div>

      <textarea
        class="piq-comment"
        name="${escapeHtml(q.question_id)}_comment"
        placeholder="Optionaler Kommentar"
      ></textarea>
    `;

    form.appendChild(div);
  });

  updateSurveyProgress();

  form.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener("change", updateSurveyProgress);
  });

  const submitButton = document.getElementById("piq-survey-submit");
  submitButton.style.display = "inline-block";
  submitButton.addEventListener("click", submitSurvey);
}

/* =========================================================
   SURVEY: Dynamic progress bubble
   Shows the first unanswered question.
   ========================================================= */

function updateSurveyProgress() {
  const progress = document.getElementById("piq-survey-progress");

  if (!progress || !piqQuestions.length) {
    return;
  }

  const answeredCount = piqQuestions.filter(q =>
    document.querySelector(`input[name="${CSS.escape(q.question_id)}"]:checked`)
  ).length;

  const currentQuestion = Math.min(answeredCount + 1, piqQuestions.length);

  progress.innerText = `Frage ${currentQuestion} von ${piqQuestions.length}`;
}

/* =========================================================
   SURVEY: Geo lookup for country / region / city
   ========================================================= */

async function getGeoInfo() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const geo = await response.json();

    return {
      geo_country: geo.country_name || "",
      geo_country_code: geo.country_code || "",
      geo_region: geo.region || "",
      geo_city: geo.city || ""
    };
  } catch (error) {
    console.warn("Geo lookup failed", error);
    return {
      geo_country: "",
      geo_country_code: "",
      geo_region: "",
      geo_city: ""
    };
  }
}

/* =========================================================
   SURVEY: Submit responses to Google Sheets endpoint
   ========================================================= */

async function submitSurvey() {
  const responses = [];

  for (const q of piqQuestions) {
    const selected = document.querySelector(`input[name="${CSS.escape(q.question_id)}"]:checked`);

    if (!selected) {
      document.getElementById("piq-survey-message").innerText =
        "Bitte beantworte alle Fragen.";
      return;
    }

    const commentField = document.querySelector(
      `textarea[name="${CSS.escape(q.question_id)}_comment"]`
    );

    responses.push({
      question_id: q.question_id,
      topic_id: q.topic_id,
      question_area_id: q.question_area_id,
      question_text: q.question_text,
      answer_value: selected.value,
      answer_label: selected.dataset.label,
      comment: commentField ? commentField.value.trim() : ""
    });
  }

  const submitButton = document.getElementById("piq-survey-submit");
  submitButton.disabled = true;
  document.getElementById("piq-survey-message").innerText =
    "Antworten werden gespeichert...";

  try {
    const geoInfo = await getGeoInfo();

    await fetch(PIQ_CONFIG.SURVEY_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_id: piqSessionId,
        source: "peopleIQ topic page - " + (piqCurrentTopic?.topic_id || ""),
        topic_id: piqCurrentTopic?.topic_id || "",
        repository_version: piqRepositoryVersion,
        geo_country: geoInfo.geo_country,
        geo_country_code: geoInfo.geo_country_code,
        geo_region: geoInfo.geo_region,
        geo_city: geoInfo.geo_city,
        responses: responses
      })
    });

    document.getElementById("piq-survey-message").innerText =
      "Danke! Deine Antworten wurden gespeichert.";
    document.getElementById("piq-survey-form").style.display = "none";
    document.getElementById("piq-survey-submit").style.display = "none";
    document.getElementById("piq-survey-progress").style.display = "none";

  } catch (error) {
    console.error("PIQ SUBMIT ERROR:", error);
    document.getElementById("piq-survey-message").innerText =
      "Fehler beim Speichern. Bitte später erneut versuchen.";
    submitButton.disabled = false;
  }
}

/* =========================================================
   BOOTSTRAP
   Loads page content from Google Sheets Content API.
   ========================================================= */

fetch(`${PIQ_CONFIG.CONTENT_API_URL}?slug=${encodeURIComponent(PIQ_CONFIG.SLUG)}`)
  .then(response => {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
  })
  .then(renderPage)
  .catch(error => {
    console.error("PIQ ERROR:", error);
    document.getElementById("piq-topic-page").innerHTML =
      `<div class="piq-section">
        <div class="piq-card">
          <h2>Die Seite konnte nicht geladen werden.</h2>
          <p><strong>Fehler:</strong> ${escapeHtml(error.message)}</p>
        </div>
      </div>`;
  });
