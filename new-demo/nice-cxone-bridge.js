(function (s, u, r, f, l, y) {
  s[f] = s[f] || {
    init: function () {
      s[f].q = arguments;
    },
  };
  l = u.createElement(r);
  y = u.getElementsByTagName(r)[0];
  l.async = 1;
  l.src = "https://surfly.com/surfly.js";
  y.parentNode.insertBefore(l, y);
})(window, document, "script", "Surfly");

(function (window) {
    window.SurflyNICEBridge = {
      init: function (options) {
        options = options || {};
  
        // Normalize trigger: accept string, regex, or function
        var trigger = options.trigger;
        var matchesTrigger;
  
        if (typeof trigger === "function") {
          matchesTrigger = trigger;
        } else if (trigger instanceof RegExp) {
          matchesTrigger = function (msg) { return trigger.test(msg); };
        } else if (typeof trigger === "string") {
          matchesTrigger = function (msg) { return msg === trigger; };
        } else {
          // Default fallback
          matchesTrigger = function (msg) { return msg === "#COBROWSE#"; };
        }
  
        var customerName = null;
        var customerCaseNumber = null;
  
        window.addEventListener("message", function (event) {
          if (event.origin !== window.location.origin) return;
  
          var data = event.data;
          if (!data || data.actionType !== "MESSAGE_RECEIVED") return;
  
          var action = data.action;
          if (!action) return;
  
          if (action.direction === "inbound" && action.author && action.author.name) {
            customerName = action.author.name;
          }
          if (action.caseNumber) {
            customerCaseNumber = action.caseNumber;
          }
  
          if (!action.message || !matchesTrigger(action.message)) return;
  
          var name = customerName || (action.author && action.author.name) || "Customer";
          var caseNum = customerCaseNumber || action.caseNumber || "unknown";
  
          console.log("[SurflyNICEBridge] Launching co-browse", { name: name, caseNum: caseNum });
  
          if (typeof options.onStart === "function") {
            options.onStart({ name: name, caseNum: caseNum });
          } else {
            Surfly.session().startLeader(null, {
              name: name + " — Case " + caseNum
            });
          }
        });
      }
    };
  })(window);
