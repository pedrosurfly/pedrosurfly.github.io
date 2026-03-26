// ==UserScript==
// @name         Surfly + NICE CXone — Demo Injector
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Injects Surfly + NICE CXone chat + co-browse trigger on any page
// @author       Pedro
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // Surfly loader
  (function (s, u, r, f, l, y) {
    s[f] = s[f] || {
      init: function () {
        s[f].q = arguments;
      },
    };
    l = u.createElement(r);
    l.async = 1;
    l.src = "https://surfly.com/surfly.js";
    y = u.getElementsByTagName(r)[0];
    if (y && y.parentNode) {
      y.parentNode.insertBefore(l, y);
    } else {
      u.head.appendChild(l);
    }
  })(window, document, "script", "Surfly");

  var settings = {
    widget_key: "134f5fd2ac8842c0a1cd6062818eee74", //replace with your Surfly Widget Key
    block_until_agent_joins: true,
  };

  Surfly.init(settings, function (initResult) {
    if (initResult.success) {
      if (!Surfly.isInsideSession) {

        // NICE CXone loader — rewritten with explicit statements
        var cxoneUrl = "https://web-modules-de-na1.niceincontact.com/loader/1/loader.js";
        window.CXoneDfo = "cxone";
        window["cxone"] = window["cxone"] || function () {
          (window["cxone"].q = window["cxone"].q || []).push(arguments);
        };
        window["cxone"].u = cxoneUrl;
        var cxoneScript = document.createElement("script");
        cxoneScript.type = "module";
        cxoneScript.src = cxoneUrl + "?" + Math.round(Date.now() / 1e3 / 3600);
        document.head.appendChild(cxoneScript);

        cxone("init", "1022");
        cxone("chat", "init", 1022, "chat_4bc8d701-a316-4b5f-bc12-9c45f766dbd0");

        // Add your chat above here
        cxone("chat", "setAllowedExternalMessageTypes", [
          "MESSAGE_SENT",
          "MESSAGE_RECEIVED",
        ]);

        window.addEventListener("message", function (event) {
          console.log(event, `event ${new Date().toISOString()}`);

          if (event.data && event.data.actionType === "MESSAGE_RECEIVED") {
            const messageContent = event.data.action?.message;

            if (messageContent === "#COBROWSE#") {
              console.log("Cobrowse message received:", event.data);
              Surfly.session().startLeader(null, {
                name: `${event.data.action?.caseNumber}`
              });
            }
          }
        });

      }
    } else {
      console.log("Surfly was unable to initialize properly.");
    }
  });

})();
