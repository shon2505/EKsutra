"use client";

import { useEffect } from "react";

export default function TranslateWidget() {
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
      
      // @ts-ignore
      window.googleTranslateElementInit = () => {
        // @ts-ignore
        new window.google.translate.TranslateElement({ 
          pageLanguage: "en", 
          includedLanguages: "en,hi,bn,te,mr,ta,gu,kn,ml,pa,ur"
        }, "google_translate_element");
      };
    }
  }, []);

  return <div id="google_translate_element"></div>;
}
