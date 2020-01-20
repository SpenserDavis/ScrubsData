const getByteArray = str => {
  const byteCharacters = atob(str);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
};

const detectMimeType = b64 => {
  const signatures = {
    JVBERi0: "pdf",
    R0lGODdh: "gif",
    R0lGODlh: "gif",
    iVBORw0KGgo: "png",
    "/9j/4AAQ": "jpg",
    UEsDBBQABgAIAAAAIQD: "doc",
    UEsDBBQABgAIAAAAIQB: "xlsx"
  };
  for (let s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s];
    }
  }
};

export { getByteArray, detectMimeType };
