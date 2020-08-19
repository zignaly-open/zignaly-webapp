window.zESettings = {
  webWidget: {
    position: { horizontal: "right", vertical: "bottom" },
    offset: {
      horizontal: "-10px",
      vertical: "-5px",
      mobile: {
        horizontal: "-10px",
        vertical: "-5px",
      },
    },
  },
};

var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://static.zdassets.com/ekr/snippet.js?key=374628c3-7648-4afb-96c4-c13bc6408a8f";
script.id = "ze-snippet";
script.async = true;
script.defer = true;
document.getElementsByTagName("head")[0].appendChild(script);
