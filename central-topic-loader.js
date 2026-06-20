/* =========================================================
   PEOPLEIQ TOPIC PAGE LOADER
   CSS SECTION
   ========================================================= */

/* ---------- Root wrapper / WordPress full-width breakout ---------- */
#piq-topic-page {
  font-family: var(--piq-font-family, Arial, sans-serif);
  color: var(--piq-text-color, #1F2937);
  background: var(--piq-background-color, #FAFAFA);
  width: 100vw;
  max-width: none;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

/* ---------- Loading skeleton ---------- */
.piq-loading-hero {
  min-height: var(--piq-hero-min-height, 650px);
  background: #E5E7EB;
  display: flex;
  align-items: center;
}

.piq-loading-content {
  max-width: var(--piq-hero-content-width, 1400px);
  width: 100%;
  margin: 0 auto;
  padding: var(--piq-hero-content-padding, 72px 60px);
}

.piq-skeleton {
  background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 37%, #E5E7EB 63%);
  background-size: 400% 100%;
  animation: piqSkeleton 1.4s ease infinite;
  border-radius: 6px;
  margin-bottom: 18px;
}

.piq-skeleton.small { width: 180px; height: 18px; }
.piq-skeleton.title { width: min(760px, 80%); height: 72px; }
.piq-skeleton.text { width: min(680px, 75%); height: 22px; }
.piq-skeleton.button { width: 170px; height: 48px; margin-top: 18px; }

@keyframes piqSkeleton {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

/* ---------- Shared layout ---------- */
.piq-section {
  max-width: var(--piq-max-content-width, 1200px);
  margin: 0 auto;
  padding: var(--piq-section-spacing, 80px) 24px;
}

.piq-intro-section {
  max-width: var(--piq-intro-width, 1100px);
}

.piq-survey-section {
  max-width: var(--piq-survey-width, 1100px) !important;
}

.piq-article {
  max-width: var(--piq-article-width, 1100px);
}

.piq-about-content {
  max-width: var(--piq-about-width, 1100px);
  margin: 0 auto;
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

/* ---------- Hero ---------- */
.piq-hero {
  min-height: var(--piq-hero-min-height, 650px);
  background-size: cover;
  background-position: var(--piq-hero-background-position, center center);
  color: #fff;
}

.piq-hero-overlay {
  min-height: var(--piq-hero-min-height, 650px);
  display: flex;
  align-items: center;
  background: linear-gradient(
    rgba(0,0,0,var(--piq-hero-overlay-opacity, .55)),
    rgba(0,0,0,var(--piq-hero-overlay-opacity, .55))
  );
}

.piq-hero-content {
  max-width: var(--piq-hero-content-width, 1400px);
  margin: 0 auto;
  padding: var(--piq-hero-content-padding, 72px 60px);
  width: 100%;
}

.piq-hero-kicker {
  font-size: var(--piq-hero-kicker-font-size, 16px);
  text-transform: var(--piq-hero-kicker-transform, uppercase);
  letter-spacing: .06em;
  font-weight: 700;
  margin: 0 0 16px;
}

.piq-hero h1 {
  font-size: var(--piq-h1-font-size, 60px);
  line-height: 1.05;
  margin: 0 0 22px;
  max-width: var(--piq-hero-headline-max-width, 900px);
}

.piq-hero p {
  font-size: var(--piq-body-font-size, 18px);
  max-width: var(--piq-hero-text-max-width, 820px);
}

/* ---------- Buttons and cards ---------- */
.piq-button {
  display: inline-block;
  padding: var(--piq-button-padding, 14px 24px);
  border-radius: var(--piq-button-radius, 4px);
  background: var(--piq-primary-color, #045D63);
  color: #fff;
  text-decoration: none;
  font-weight: var(--piq-button-font-weight, 600);
  border: none;
  cursor: pointer;
  margin-top: 18px;
}

.piq-button:hover {
  background: var(--piq-primary-hover-color, #0B6C7F);
}

.piq-card {
  background: var(--piq-surface-color, #fff);
  border: 1px solid var(--piq-border-color, #DDE3E8);
  border-radius: var(--piq-card-radius, 8px);
  padding: var(--piq-card-padding, 32px);
  margin-bottom: 20px;
  box-shadow: var(--piq-card-shadow, none);
}

.piq-muted {
  color: var(--piq-text-muted-color, #6B7280);
}

/* ---------- Related topics ---------- */
.piq-related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.piq-related-card {
  display: block;
  color: inherit;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.piq-related-card:hover {
  transform: translateY(-2px);
}

/* ---------- Survey ---------- */
.piq-question {
  border: 1px solid var(--piq-border-color, #DDE3E8);
  border-radius: var(--piq-card-radius, 8px);
  padding: 28px;
  margin: 22px 0;
  background: var(--piq-survey-question-background, #F4F8F8);
}

.piq-question h3 {
  font-size: 20px;
  line-height: 1.4;
  margin: 8px 0 16px;
}

.piq-topic-label {
  font-size: 14px;
  color: var(--piq-secondary-color, #2C718A);
  font-weight: 600;
}

.piq-options label {
  display: block;
  margin: 10px 0;
  cursor: pointer;
}

.piq-survey-floating-progress {
  position: sticky;
  top: 16px;
  z-index: 5;
  background: var(--piq-surface-color, #FFFFFF);
  border: 1px solid var(--piq-border-color, #DDE3E8);
  border-radius: 999px;
  padding: 10px 18px;
  margin: 0 0 24px;
  display: inline-block;
  font-weight: 700;
  color: var(--piq-secondary-color, #2C718A);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.piq-comment {
  width: 100%;
  min-height: 80px;
  margin-top: 14px;
  padding: 12px;
  border: 1px solid var(--piq-border-color, #DDE3E8);
  border-radius: var(--piq-button-radius, 4px);
  font-family: var(--piq-font-family, Arial, sans-serif);
  font-size: 15px;
  box-sizing: border-box;
}

#piq-survey-message {
  margin-top: 18px;
  font-weight: 700;
}

/* ---------- references ---------- */

.piq-references {
  margin-top: 48px;
  padding-top: 24px;
  padding-bottom: 24px;

  border-top: 1px solid var(--piq-border-color, #DDE3E8);
  border-bottom: 1px solid var(--piq-border-color, #DDE3E8);

  font-size: 14px;
  color: var(--piq-text-muted-color, #6B7280);

  width: 100%;
  box-sizing: border-box;
}

.piq-references h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--piq-text-muted-color, #6B7280);
}

.piq-references ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.piq-references li {
  margin: 6px 0;
}

.piq-references a {
  color: inherit;
  text-decoration: none;
}

.piq-references a:hover {
  text-decoration: underline;
}


/* ---------- FAQ ---------- */
.piq-faq-card {
  padding: var(--piq-faq-card-padding, 20px 24px);
  margin-bottom: var(--piq-faq-spacing, 12px);
}

.piq-faq-question {
  font-size: var(--piq-faq-question-font-size, 22px);
  line-height: 1.3;
  margin: 0 0 10px;
}

.piq-faq-answer {
  font-size: var(--piq-faq-answer-font-size, 16px);
  line-height: 1.6;
  margin: 0;
}

/* ---------- Mobile ---------- */
@media (max-width: 700px) {
  .piq-section { padding: 48px 20px; }

  .piq-hero,
  .piq-hero-overlay {
    min-height: var(--piq-hero-mobile-min-height, 520px);
  }

  .piq-hero-content {
    padding: var(--piq-hero-mobile-content-padding, 56px 24px);
  }

  .piq-hero h1 {
    font-size: var(--piq-h1-mobile-font-size, 36px);
  }
}
