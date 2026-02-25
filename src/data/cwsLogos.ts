// cwsLogos.ts
// Maps ESPN Baseball team IDs for the Caribbean Series to verified Wikipedia images.
// Teams without a verified high-quality federation crest here will fallback automatically
// to ESPN's country flags (e.g. dom.png, mex.png) to prevent 404 image errors in the UI.

export const CWS_LOGOS: Record<string, string> = {
    // Verified working URL for Probeis (Panama Winter League)
    "19": "https://upload.wikimedia.org/wikipedia/en/6/62/Probeis_logo.png", // Panama
};
