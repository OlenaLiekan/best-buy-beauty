import React from "react"
import ContentLoader from "react-content-loader"

const MenuSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width={260}
    height={46}
    viewBox="0 0 260 46"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="24" y="16" rx="6" ry="6" width="230" height="26" />
  </ContentLoader>
)

export default MenuSkeleton;

