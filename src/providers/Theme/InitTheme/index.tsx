import Script from "next/script";
import React from "react";

import { defaultTheme, themeStorageKey } from "../shared";

export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(){
  function getImplicitPreference() {
    var mql = window.matchMedia('(prefers-color-scheme: dark)')
    return typeof mql.matches === 'boolean' ? (mql.matches ? 'dark' : 'light') : null
  }

  function themeIsValid(theme) {
    return theme === 'light' || theme === 'dark'
  }

  var themeToSet = '${defaultTheme}'
  var preference = window.localStorage.getItem('${themeStorageKey}')

  if (themeIsValid(preference)) {
    themeToSet = preference
  } else {
    var implicitPreference = getImplicitPreference()
    if (implicitPreference) themeToSet = implicitPreference
  }

  document.documentElement.setAttribute('data-theme', themeToSet)
})();`,
      }}
    />
  );
};
