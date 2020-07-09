window.fwSettings = {
  widget_id: 48000001413,
};

!(function () {
  if ("function" != typeof window.FreshworksWidget) {
    var n = function () {
      n.q.push(arguments);
    };
    (n.q = []), (window.FreshworksWidget = n);
  }
})();

var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://widget.freshworks.com/widgets/48000001413.js";
script.async = true;
script.defer = true;
document.getElementsByTagName("head")[0].appendChild(script);
