(function () {
  var APPLE_URL = "https://apps.apple.com/app/fast-cleaner-ai-photo-clean/id6446206167";
  var GOOGLE_URL = "https://play.google.com/store/apps/details?id=com.crocapps.fastcleaner";

  function isIOS() {
    var ua = navigator.userAgent || navigator.vendor || "";
    var iOSDevice = /iPad|iPhone|iPod/.test(ua);
    var iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return iOSDevice || iPadOS;
  }

  function isAndroid() {
    return /Android/i.test(navigator.userAgent || navigator.vendor || "");
  }

  function withArrow(label, sourceText) {
    return /\u2192/.test(sourceText) ? label + " \u2192" : label;
  }

  function getIOSLabel(sourceText) {
    return withArrow("Download on App Store", sourceText || "");
  }

  function getAndroidLabel(sourceText) {
    return withArrow("Get it on Google Play", sourceText || "");
  }

  function isStoreLink(link, store) {
    var href = link.getAttribute("href") || "";
    return store === "ios" ? href.indexOf("apps.apple.com") !== -1 : href.indexOf("play.google.com") !== -1;
  }

  function getButtonGroup(link) {
    if (link.closest("[data-smart-download-ignore]")) {
      return null;
    }
    return link.closest(".store-actions") || link.parentElement;
  }

  function showBothIfDesktop(group) {
    group.querySelectorAll("a.btn").forEach(function (button) {
      button.hidden = false;
    });
  }

  function hideNonMatching(group, platform) {
    var singleMobile = group.getAttribute("data-smart-download-group") === "single-mobile";
    group.querySelectorAll("a.btn").forEach(function (button) {
      var isIOSButton = isStoreLink(button, "ios");
      var isAndroidButton = isStoreLink(button, "android");
      if (!isIOSButton && !isAndroidButton) {
        button.hidden = singleMobile;
        return;
      }
      if (platform === "ios") {
        button.hidden = !isIOSButton;
      } else if (platform === "android") {
        button.hidden = !isAndroidButton;
      }
    });
  }

  function ensureDesktopPair(group, iosButton) {
    if (!group || group.querySelector('a.btn[href*="play.google.com"]')) {
      return;
    }
    var playButton = iosButton.cloneNode(true);
    playButton.href = GOOGLE_URL;
    playButton.textContent = getAndroidLabel(iosButton.textContent);
    playButton.classList.add("outline");
    playButton.hidden = false;
    playButton.setAttribute("data-smart-injected", "android");
    if (!group.classList.contains("store-actions")) {
      playButton.style.marginLeft = "12px";
    }
    group.appendChild(playButton);
  }

  function swapSingleButton(button, platform) {
    if (platform === "android") {
      button.href = GOOGLE_URL;
      button.textContent = getAndroidLabel(button.textContent);
      button.setAttribute("data-smart-store", "android");
    } else if (platform === "ios") {
      button.href = APPLE_URL;
      button.textContent = getIOSLabel(button.textContent);
      button.setAttribute("data-smart-store", "ios");
    }
  }

  function updateGroup(group, platform) {
    var buttons = Array.prototype.slice.call(group.querySelectorAll("a.btn"));
    var iosButton = buttons.find(function (button) { return isStoreLink(button, "ios"); });
    var androidButton = buttons.find(function (button) { return isStoreLink(button, "android"); });

    if (iosButton && androidButton) {
      if (platform === "desktop") {
        showBothIfDesktop(group);
      } else {
        hideNonMatching(group, platform);
      }
      return;
    }

    if (iosButton && platform === "desktop" && !iosButton.classList.contains("nav-cta")) {
      ensureDesktopPair(group, iosButton);
      return;
    }

    if (iosButton && platform === "android") {
      swapSingleButton(iosButton, "android");
      return;
    }

    if (androidButton && platform === "ios") {
      swapSingleButton(androidButton, "ios");
    }
  }

  function initSmartDownloads() {
    var platform = "desktop";
    if (isAndroid()) {
      platform = "android";
    } else if (isIOS()) {
      platform = "ios";
    }

    var seen = new Set();
    document.querySelectorAll('a.btn[href*="apps.apple.com"], a.btn[href*="play.google.com"]').forEach(function (link) {
      var group = getButtonGroup(link);
      if (!group || seen.has(group)) {
        return;
      }
      seen.add(group);
      updateGroup(group, platform);
    });

    document.querySelectorAll(".nav-cta").forEach(function (button) {
      if (platform === "desktop") {
        button.hidden = true;
        return;
      }
      button.hidden = false;
      swapSingleButton(button, platform);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSmartDownloads);
  } else {
    initSmartDownloads();
  }
})();
