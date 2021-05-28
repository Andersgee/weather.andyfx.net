require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@src": "src",
          "@assets": "src/assets",
          "@components": "src/components",
          "@hooks": "src/hooks",
          "@js": "src/js",
          "@pages": "src/pages",
          "@templates": "src/templates",
          "@styles": "src/styles",
        },
        extensions: ["js", "jsx", "scss"],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Weather`,
        short_name: `Weather`,
        description: `How much water a tree needs, based on weather data.`,
        lang: `en`,
        display: `standalone`,
        icon: `src/images/andyfx.png`,
        start_url: `/`,
        background_color: `#F5F8FC`,
        theme_color: `#A6CDF5`,
        theme_color_in_head: false,
      },
    },
  ],
};
