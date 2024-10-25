import React from "react"
import ContentLoader from "react-content-loader"

const LogoLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={90}
    height={90}
    viewBox="0 0 90 90"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="90" height="90" />
  </ContentLoader>
)

export default LogoLoader;