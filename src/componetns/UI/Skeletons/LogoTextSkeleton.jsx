import React from "react"
import ContentLoader from "react-content-loader"

const LogoTextLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={200}
    height={30}
    viewBox="0 0 200 30"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="200" height="30" />
  </ContentLoader>
)

export default LogoTextLoader;