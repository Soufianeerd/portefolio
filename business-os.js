(function () {
  "use strict";

  var DEFAULT_BUSINESS_OS_URL = "https://app.serguides.fr";
  var SITE_KEY = "portfolio";

  function getBaseUrl() {
    var raw =
      (typeof window.BUSINESS_OS_URL === "string" && window.BUSINESS_OS_URL.trim()) ||
      DEFAULT_BUSINESS_OS_URL;
    return raw.replace(/\/+$/, "");
  }

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search || "");
    return {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || ""
    };
  }

  function sendTrack(eventType, extra) {
    var baseUrl = getBaseUrl();
    var utm = getUtmParams();
    var payload = {
      site_key: SITE_KEY,
      event_type: eventType,
      path: window.location.pathname || "/",
      referrer: document.referrer || "",
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign
    };

    if (extra && typeof extra === "object") {
      Object.keys(extra).forEach(function (key) {
        if (extra[key] !== undefined) {
          payload[key] = extra[key];
        }
      });
    }

    try {
      fetch(baseUrl + "/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify(payload)
      }).catch(function () {
        // Silencieux : le suivi anonymisé ne doit jamais bloquer la navigation.
      });
    } catch (_err) {
      // Ignore les environnements sans fetch.
    }
  }

  function normalizeWebsiteUrl(value) {
    var trimmed = (value || "").trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) {
      return "https://" + trimmed;
    }
    return trimmed;
  }

  function setFeedback(el, type, text) {
    if (!el) return;
    el.hidden = false;
    el.className = "form-feedback " + type;
    el.textContent = text;
  }

  /**
   * Filet de sécurité : si le back-office est injoignable (réseau, 5xx), la demande est
   * enregistrée dans Netlify Forms pour ne jamais être perdue.
   */
  function submitToNetlifyForms(payload) {
    var body = new URLSearchParams();
    body.append("form-name", "contact");
    Object.keys(payload).forEach(function (key) {
      body.append(key, payload[key] == null ? "" : String(payload[key]));
    });
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    }).then(function (response) {
      if (!response.ok) throw new Error("Envoi de secours impossible.");
      return { ok: true, fallback: true };
    });
  }

  function bindLeadForm() {
    var form = document.getElementById("lead-form");
    if (!form) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    var feedbackEl = form.querySelector("[data-form-feedback]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(form);
      var fullName = String(data.get("full_name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var company = String(data.get("company") || "").trim();
      var websiteUrl = normalizeWebsiteUrl(String(data.get("website_url") || ""));
      var serviceInterest = String(data.get("service_interest") || "audit-securite-rgpd").trim();
      var message = String(data.get("message") || "").trim();
      var websiteHp = String(data.get("website_hp") || "");

      if (!fullName || !email || !message) {
        setFeedback(
          feedbackEl,
          "error",
          "Merci de renseigner au minimum votre nom, votre email et votre message."
        );
        return;
      }

      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Envoi en cours…";
      }
      if (feedbackEl) {
        feedbackEl.hidden = true;
      }

      var payload = {
        source_site: SITE_KEY,
        full_name: fullName,
        email: email,
        phone: phone,
        company: company,
        website_url: websiteUrl,
        service_interest: serviceInterest,
        message: message,
        website_hp: websiteHp
      };

      fetch(getBaseUrl() + "/api/public/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      })
        .catch(function () {
          return null; // réseau / DNS / CORS : back-office injoignable
        })
        .then(function (response) {
          if (!response) {
            return submitToNetlifyForms(payload);
          }
          if (response.status >= 500) {
            return submitToNetlifyForms(payload);
          }
          if (!response.ok) {
            return response
              .json()
              .catch(function () {
                return {};
              })
              .then(function (errBody) {
                var detail =
                  (errBody && (errBody.error || errBody.message)) ||
                  "Impossible d'enregistrer votre demande pour le moment.";
                throw new Error(detail);
              });
          }
          return response.json().catch(function () {
            return { ok: true };
          });
        })
        .then(function () {
          setFeedback(
            feedbackEl,
            "success",
            "Merci ! Votre demande a bien été transmise. Je reviens vers vous rapidement."
          );
          form.reset();
        })
        .catch(function (err) {
          setFeedback(
            feedbackEl,
            "error",
            (err && err.message ? err.message + " " : "") +
              "Vous pouvez aussi m'écrire à soufiane.erd@gmail.com ou m'appeler au 07 66 16 80 39."
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });
  }

  function bindClickTrackingAndServicePreselect() {
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== "function") return;

      var serviceTrigger = target.closest("[data-select-service]");
      if (serviceTrigger) {
        var select = document.getElementById("lead-service-interest");
        var serviceVal = serviceTrigger.getAttribute("data-select-service");
        if (select && serviceVal) {
          select.value = serviceVal;
        }
      }

      var trackEl = target.closest("[data-track-cta]");
      if (trackEl) {
        var label = trackEl.getAttribute("data-track-cta") || "";
        if (label) {
          sendTrack("cta_click", { cta_label: label });
        }
      }
    });
  }

  function init() {
    sendTrack("pageview");
    bindClickTrackingAndServicePreselect();
    bindLeadForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
