import { useStaticQuery, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

//only get the andyfx image
const query = graphql`
  {
    allFile(
      filter: { sourceInstanceName: { eq: "images" }, name: { eq: "andyfx" } }
    ) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
            layout: FULL_WIDTH
          )
        }
      }
    }
  }
`;

export default function useImages() {
  const { allFile } = useStaticQuery(query);
  let images = {};
  for (let image of allFile.nodes) {
    images[image.name] = getImage(image);
  }
  return images;
}
