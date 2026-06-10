export const glassoutConfig = {
  serverBaseUrl: "http://192.168.1.232:8787",
  defaultAircraft: "crj700",
  aircraft: {
    crj700: {
      name: "CRJ 700",
      windows: {
        main: {
          layout: "two-columns",
          panels: [
            { id: "pfdc", path: "/panel/pfdc?fps=60" },
            { id: "mfdc", path: "/panel/mfdc?fps=60" }
          ]
        },
        eic: {
          layout: "eic-strip",
          panels: [
            { id: "eic1", path: "/panel/eic1?fps=60" },
            { id: "isi", path: "/panel/isi?fps=60", className: "isi" },
            { id: "eic2", path: "/panel/eic2?fps=60" }
          ]
        },
        mcdu: {
          layout: "single-panel",
          panels: [
            { id: "mcdu1", path: "/panel/mcdu1?fps=60", className: "mcdu-panel" }
          ]
        }
      }
    }
  }
};
