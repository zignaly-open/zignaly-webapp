import React from "react";
import { Link } from "gatsby";
import cs from "../../images/cs.png";
import en from "../../images/en.png";
import { languages, getLocalizedPath } from "../../i18n";
import { PageContext } from "../../pageContext";
import "./languageSwitcher.scss";
const flags = {
  cs,
  en,
};

const LanguageSwitcher = () => (
  <PageContext.Consumer>
    {({ originalPath, locale }) => (
      <div className="languageSwitcher">
        {languages.map((lang) =>
          lang.locale === locale ? (
            <img alt={lang.label} key={lang.locale} src={flags[lang.locale]} />
          ) : (
            <Link key={lang.locale} to={getLocalizedPath(originalPath, lang.locale)}>
              <img alt={lang.label} src={flags[lang.locale]} />
            </Link>
          ),
        )}
      </div>
    )}
  </PageContext.Consumer>
);

export default LanguageSwitcher;
