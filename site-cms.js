import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const target = document.getElementById("community-content");
if (
  target &&
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_")
) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const escapeText = (value) => String(value ?? "");

  const renderSection = (section) => {
    const article = document.createElement("article");
    article.className = `community-section community-section-${section.section_type}`;

    if (
      section.media_url &&
      /^https:\/\//i.test(section.media_url) &&
      ["image", "video"].includes(section.section_type)
    ) {
      const media = document.createElement(
        section.section_type === "video" ? "video" : "img",
      );
      media.src = section.media_url;
      if (media instanceof HTMLVideoElement) {
        media.controls = true;
        media.preload = "metadata";
      } else {
        media.alt = escapeText(section.title);
        media.loading = "lazy";
      }
      article.append(media);
    }

    const copy = document.createElement("div");
    copy.className = "community-section-copy";
    if (section.kicker) {
      const kicker = document.createElement("p");
      kicker.className = "section-label";
      kicker.textContent = escapeText(section.kicker);
      copy.append(kicker);
    }
    const title = document.createElement("h2");
    title.textContent = escapeText(section.title);
    copy.append(title);
    if (section.body) {
      const body = document.createElement("p");
      body.textContent = escapeText(section.body);
      copy.append(body);
    }
    if (section.button_text && section.button_url) {
      const button = document.createElement("a");
      button.className = "button button-gold";
      button.textContent = escapeText(section.button_text);
      const url = section.button_url.trim();
      if (
        url.startsWith("#") ||
        /^https:\/\//i.test(url) ||
        /^mailto:/i.test(url)
      ) {
        button.href = url;
        if (/^https:\/\//i.test(url)) {
          button.target = "_blank";
          button.rel = "noopener noreferrer";
        }
        copy.append(button);
      }
    }
    article.append(copy);
    if (section.existing_key) {
      const original = document.getElementById(section.existing_key);
      if (original) {
        const replacement = document.createElement("section");
        replacement.id = section.existing_key;
        replacement.className = `section-wrap cms-managed-section cms-managed-${section.section_type}`;
        replacement.append(article);
        original.replaceWith(replacement);
        return;
      }
    }
    target.append(article);
  };

  supabase
    .from("site_sections")
    .select(
      "existing_key, section_type, title, kicker, body, button_text, button_url, media_url, media_type",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .then(({ data, error }) => {
      if (error) {
        console.warn("Community sections could not be loaded:", error.message);
        return;
      }
      data.forEach(renderSection);
    });
}
