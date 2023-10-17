import React from "react"
import ContentLoader from "react-content-loader"

const BrandsSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width={120}
    height={54}
    viewBox="0 0 120 54"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="2" rx="20" ry="20" width="120" height="52" />
  </ContentLoader>
)

export default BrandsSkeleton;