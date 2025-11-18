module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "classic" }] // classic exige import React; se quiser sem import, use "automatic"
  ],
};
