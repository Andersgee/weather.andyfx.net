import * as React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useLocation } from "@reach/router";

const Seo = ({ title, description, image, article, lang }) => {
  const { pathname } = useLocation();
  //pathname will be "/" for root

  const siteUrl = "https://www.andyfx.net";
  const defaultTitle = "andyfx";
  const defaultDescription = "Andyfx latest web projects and contact.";

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}/images/${image || "andyfx.png"}`,
    url: `${siteUrl}${pathname}`,
  };

  const ogtitle = title ? `${seo.title} | ${defaultTitle}` : defaultTitle;

  return (
    <Helmet
      title={ogtitle}
      htmlAttributes={{
        lang,
      }}
    >
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      <link rel="icon" type="image/png" href={`${siteUrl}/favicon.png`} />
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={ogtitle} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      {article && <meta property="og:type" content="article" />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogtitle} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
};

export default Seo;

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  lang: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
};

Seo.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false,
  lang: "en",
};
