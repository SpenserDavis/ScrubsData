import chroma from "chroma-js";

const colorScheme = shadeCount => {
  return chroma
    .scale(["#2d60e8", "#26efb5"])
    .correctLightness()
    .colors(shadeCount);
};

export default colorScheme;
