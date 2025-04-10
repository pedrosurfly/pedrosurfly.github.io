function startCobrowse(widgetKey) {
  if (!widgetKey) {
    console.error('Widget key is required')
    return
  }

  if (!window.parent.Surfly) {
    console.error('Surfly is not loaded')
    return
  }

  try {
    let customerWidgetKey = widgetKey
    window.parent.Surfly.settings.widget_key = customerWidgetKey

    if (window.parent.Surfly.settings.widget_key === customerWidgetKey) {
      console.log('widget key changed correctly:', customerWidgetKey)

      Surfly.session()
        .on('session_created', function (session, event) {
          console.log('Session created', session, event)
          var surflySessionPin = session.pin
          console.log('Surfly session pin', surflySessionPin)
          if (surflySessionPin) {
            console.log(document, 'document')
          }
        })
        .on('session_started', function (session, event) {
          console.log('Session started', session, event)
        })
        .on('error', function (error) {
          console.error('Session error:', error)
        })
        .startLeader()
    } else {
      console.error('Failed to set widget key')
    }
  } catch (error) {
    console.error('Error starting cobrowse session:', error)
  }
}

// Support both ES modules and CommonJS
if (typeof exports !== 'undefined') {
  // CommonJS/Node.js
  module.exports = { startCobrowse }
} else if (typeof define === 'function' && define.amd) {
  // AMD/RequireJS
  define([], function () {
    return { startCobrowse }
  })
} else {
  // Browser globals
  window.surflyHelper = { startCobrowse }
}
