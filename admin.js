import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const configured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_") &&
  SUPABASE_ANON_KEY.length > 20;
const setupNotice = document.getElementById("setup-notice");
const authForm = document.getElementById("auth-form");
const authMessage = document.getElementById("auth-message");
const authCard = document.getElementById("auth-card");
const workspace = document.getElementById("workspace");
const sectionManager = document.getElementById("section-manager");
const sectionForm = document.getElementById("section-form");
const sectionList = document.getElementById("section-list");
const contributionList = document.getElementById("contribution-list");
const contributionMessage = document.getElementById("contribution-message");
const MAX_FILE_BYTES = 40 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/ogg",
]);

const setMessage = (element, message, isError = false) => {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", isError);
};

const setHidden = (element, hidden) => {
  if (element) element.hidden = hidden;
};

const escapeText = (value) => String(value ?? "");
const isVideo = (mime) => String(mime || "").startsWith("video/");

if (!configured) {
  setHidden(setupNotice, false);
  authForm.querySelectorAll("input, button").forEach((control) => {
    control.disabled = true;
  });
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let currentUser = null;
  let currentRole = "visitor";

  const getProfile = async (user) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (error) throw error;
    return data?.role || "visitor";
  };

  const publicAssetUrl = (path) =>
    supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;

  const addText = (parent, tag, text, className = "") => {
    const node = document.createElement(tag);
    node.textContent = escapeText(text);
    if (className) node.className = className;
    parent.append(node);
    return node;
  };

  const loadSections = async () => {
    const { data, error } = await supabase
      .from("site_sections")
      .select(
        "id, existing_key, section_type, title, kicker, body, button_text, button_url, media_url, media_type, published, sort_order",
      )
      .order("sort_order", { ascending: true });
    if (error) throw error;
    sectionList.replaceChildren();
    if (!data.length)
      addText(
        sectionList,
        "p",
        "No custom sections yet. Select ＋ to create one.",
        "form-hint",
      );

    data.forEach((section) => {
      const row = document.createElement("article");
      row.className = "managed-section";
      const copy = document.createElement("div");
      addText(copy, "h3", section.title);
      addText(
        copy,
        "p",
        `${section.existing_key ? `Replaces ${section.existing_key}` : "New section"} · ${section.section_type} · ${section.published ? "Published" : "Draft"}${section.body ? ` · ${section.body}` : ""}`,
      );
      const actions = document.createElement("div");
      actions.className = "managed-actions";
      const edit = addText(actions, "button", "Edit", "small-action");
      edit.type = "button";
      edit.addEventListener("click", () => fillEditor(section));
      const remove = addText(
        actions,
        "button",
        "Delete",
        "small-action danger",
      );
      remove.type = "button";
      remove.addEventListener("click", async () => {
        if (!window.confirm(`Delete “${section.title}”?`)) return;
        const { error: deleteError } = await supabase
          .from("site_sections")
          .delete()
          .eq("id", section.id);
        if (deleteError)
          return setMessage(
            document.getElementById("section-message"),
            deleteError.message,
            true,
          );
        await loadSections();
      });
      row.append(copy, actions);
      sectionList.append(row);
    });
  };

  const fillEditor = (section = null) => {
    sectionForm.reset();
    document.getElementById("section-id").value = section?.id || "";
    document.getElementById("section-target").value =
      section?.existing_key || "";
    document.getElementById("section-type").value =
      section?.section_type || "story";
    document.getElementById("section-title").value = section?.title || "";
    document.getElementById("section-kicker").value = section?.kicker || "";
    document.getElementById("section-body").value = section?.body || "";
    document.getElementById("section-button").value =
      section?.button_text || "";
    document.getElementById("section-link").value = section?.button_url || "";
    document.getElementById("section-media-url").value =
      section?.media_url || "";
    document.getElementById("section-published").checked =
      section?.published ?? true;
    setMessage(document.getElementById("section-message"), "");
    setHidden(sectionForm, false);
    sectionForm.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const loadContributions = async () => {
    let query = supabase
      .from("contributions")
      .select(
        "id, contributor_id, caption, object_path, media_type, status, created_at",
      )
      .order("created_at", { ascending: false });
    if (currentRole !== "admin")
      query = query.eq("contributor_id", currentUser.id);
    const { data, error } = await query;
    if (error) throw error;
    contributionList.replaceChildren();
    if (!data.length)
      addText(
        contributionList,
        "p",
        currentRole === "admin"
          ? "No submissions to review yet."
          : "Your submissions will appear here.",
        "form-hint",
      );

    for (const contribution of data) {
      const row = document.createElement("article");
      row.className = "contribution-item";
      const { data: signed, error: signedError } = await supabase.storage
        .from("community-contributions")
        .createSignedUrl(contribution.object_path, 60 * 10);
      if (!signedError && signed?.signedUrl) {
        const preview = document.createElement(
          isVideo(contribution.media_type) ? "video" : "img",
        );
        preview.src = signed.signedUrl;
        if (preview instanceof HTMLVideoElement) preview.controls = true;
        preview.alt = contribution.caption;
        row.append(preview);
      } else {
        const placeholder = document.createElement("div");
        placeholder.textContent = "Private media";
        row.append(placeholder);
      }
      const details = document.createElement("div");
      addText(details, "h3", contribution.caption);
      addText(details, "p", new Date(contribution.created_at).toLocaleString());
      addText(details, "span", contribution.status, "contribution-status");
      const actions = document.createElement("div");
      actions.className = "managed-actions";
      if (currentRole === "admin" && contribution.status === "pending") {
        const approve = addText(
          actions,
          "button",
          "Approve & publish",
          "small-action",
        );
        approve.type = "button";
        approve.addEventListener("click", () =>
          approveContribution(contribution),
        );
        const reject = addText(
          actions,
          "button",
          "Reject",
          "small-action danger",
        );
        reject.type = "button";
        reject.addEventListener("click", async () => {
          const { error: updateError } = await supabase
            .from("contributions")
            .update({ status: "rejected" })
            .eq("id", contribution.id);
          if (updateError)
            setMessage(contributionMessage, updateError.message, true);
          else await loadContributions();
        });
      }
      row.append(details, actions);
      contributionList.append(row);
    }
  };

  const approveContribution = async (contribution) => {
    setMessage(contributionMessage, "Publishing contribution…");
    const { data: download, error: downloadError } = await supabase.storage
      .from("community-contributions")
      .download(contribution.object_path);
    if (downloadError)
      return setMessage(contributionMessage, downloadError.message, true);

    const extension =
      contribution.object_path.split(".").pop()?.toLowerCase() || "bin";
    const sitePath = `community/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("site-media")
      .upload(sitePath, download, {
        contentType: contribution.media_type,
        upsert: false,
      });
    if (uploadError)
      return setMessage(contributionMessage, uploadError.message, true);

    const { error: sectionError } = await supabase
      .from("site_sections")
      .insert({
        section_type: isVideo(contribution.media_type) ? "video" : "image",
        title: contribution.caption,
        body: "Shared by a community member.",
        media_url: publicAssetUrl(sitePath),
        media_type: contribution.media_type,
        published: true,
      });
    if (sectionError)
      return setMessage(contributionMessage, sectionError.message, true);

    const { error: statusError } = await supabase
      .from("contributions")
      .update({ status: "approved", published_path: sitePath })
      .eq("id", contribution.id);
    if (statusError)
      return setMessage(contributionMessage, statusError.message, true);
    setMessage(contributionMessage, "Approved and published on the home page.");
    await Promise.all([loadContributions(), loadSections()]);
  };

  const showWorkspace = async (session) => {
    currentUser = session?.user || null;
    setHidden(authCard, Boolean(currentUser));
    setHidden(workspace, !currentUser);
    if (!currentUser) return;
    try {
      currentRole = await getProfile(currentUser);
      document.getElementById("user-label").textContent =
        currentUser.email || "Visitor account";
      document.getElementById("role-label").textContent =
        currentRole === "admin"
          ? "Administrator · section editor and moderation access"
          : "Visitor · view your own contribution history";
      setHidden(sectionManager, currentRole !== "admin");
      document.getElementById("contribution-heading").textContent =
        currentRole === "admin"
          ? "Review community submissions."
          : "Share a photo or video.";
      document.getElementById("contribution-help").textContent =
        currentRole === "admin"
          ? "Review pending files privately. Approved media is copied to the public site and appears as a new home-page section."
          : "Submissions remain private until reviewed. Signing in lets you check status here; an account is optional for untracked submissions.";
      await Promise.all([
        currentRole === "admin" ? loadSections() : Promise.resolve(),
        loadContributions(),
      ]);
    } catch (error) {
      setMessage(authMessage, error.message, true);
    }
  };

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(authMessage, "Signing in…");
    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setMessage(authMessage, error.message, true);
    await showWorkspace(data.session);
  });

  document
    .getElementById("signup-button")
    .addEventListener("click", async () => {
      setMessage(authMessage, "Creating visitor account…");
      const email = document.getElementById("auth-email").value.trim();
      const password = document.getElementById("auth-password").value;
      if (!email || password.length < 8) {
        return setMessage(
          authMessage,
          "Enter an email and a password with at least 8 characters.",
          true,
        );
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return setMessage(authMessage, error.message, true);
      if (data.session) await showWorkspace(data.session);
      else
        setMessage(
          authMessage,
          "Check your email to confirm the account, then sign in.",
        );
    });

  document
    .getElementById("guest-button")
    .addEventListener("click", async () => {
      setMessage(authMessage, "Starting a guest session…");
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        return setMessage(
          authMessage,
          `Guest sign-in failed. Enable anonymous sign-ins in Supabase Auth. ${error.message}`,
          true,
        );
      }
      await showWorkspace(data.session);
    });

  document
    .getElementById("signout-button")
    .addEventListener("click", async () => {
      await supabase.auth.signOut();
      currentUser = null;
      setHidden(workspace, true);
      setHidden(authCard, false);
    });

  document
    .getElementById("add-section-button")
    .addEventListener("click", () => fillEditor());
  document
    .getElementById("cancel-section-button")
    .addEventListener("click", () => setHidden(sectionForm, true));

  sectionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.getElementById("section-message");
    setMessage(message, "Saving section…");
    const sectionId = document.getElementById("section-id").value;
    const file = document.getElementById("section-file").files[0];
    const selectedType = document.getElementById("section-type").value;
    let mediaUrl =
      document.getElementById("section-media-url").value.trim() || null;
    let mediaType = null;

    if (mediaUrl && !/^https:\/\//i.test(mediaUrl)) {
      return setMessage(message, "Media URLs must use HTTPS.", true);
    }

    if (file) {
      if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES) {
        return setMessage(
          message,
          "Choose a JPG, PNG, WEBP, GIF, MP4, WEBM or OGG file under 40 MB.",
          true,
        );
      }
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `admin/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return setMessage(message, uploadError.message, true);
      mediaUrl = publicAssetUrl(path);
      mediaType = file.type;
    } else if (mediaUrl) {
      mediaType =
        selectedType === "video" ? "video/external" : "image/external";
    }

    const payload = {
      existing_key: document.getElementById("section-target").value || null,
      section_type: selectedType,
      title: document.getElementById("section-title").value.trim(),
      kicker: document.getElementById("section-kicker").value.trim() || null,
      body: document.getElementById("section-body").value.trim() || null,
      button_text:
        document.getElementById("section-button").value.trim() || null,
      button_url: document.getElementById("section-link").value.trim() || null,
      media_url: mediaUrl,
      media_type: mediaType,
      published: document.getElementById("section-published").checked,
    };
    const result = sectionId
      ? await supabase.from("site_sections").update(payload).eq("id", sectionId)
      : await supabase.from("site_sections").insert(payload);
    if (result.error) return setMessage(message, result.error.message, true);
    setMessage(message, "Section saved.");
    setHidden(sectionForm, true);
    await loadSections();
  });

  document
    .getElementById("contribution-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const file = document.getElementById("contribution-file").files[0];
      const caption = document
        .getElementById("contribution-caption")
        .value.trim();
      if (!file || !caption)
        return setMessage(
          contributionMessage,
          "Choose a file and add a caption.",
          true,
        );
      if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES) {
        return setMessage(
          contributionMessage,
          "Choose a JPG, PNG, WEBP, GIF, MP4, WEBM or OGG file under 40 MB.",
          true,
        );
      }
      setMessage(contributionMessage, "Uploading privately for review…");
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${currentUser?.id || "anonymous"}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("community-contributions")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError)
        return setMessage(contributionMessage, uploadError.message, true);

      const { error: insertError } = await supabase
        .from("contributions")
        .insert({
          contributor_id: currentUser?.id || null,
          caption,
          object_path: path,
          media_type: file.type,
        });
      if (insertError) {
        await supabase.storage.from("community-contributions").remove([path]);
        return setMessage(contributionMessage, insertError.message, true);
      }
      event.currentTarget.reset();
      setMessage(
        contributionMessage,
        "Submitted. An admin will review it before it appears publicly.",
      );
      await loadContributions();
    });

  supabase.auth.getSession().then(({ data }) => showWorkspace(data.session));
  supabase.auth.onAuthStateChange((_event, session) => showWorkspace(session));
}
