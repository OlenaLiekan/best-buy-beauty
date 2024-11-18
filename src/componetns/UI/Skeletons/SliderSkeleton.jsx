import React from "react";
import ContentLoader from "react-content-loader";

const SliderSkeleton = (props) => (

  <ContentLoader 
    className="skeletons"
    speed={2}
    width={1920}
    height={400}
    viewBox="0 0 1920 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
    >
      <rect x="0" y="0" rx="0" ry="0" width="1200" height="400" /> 
  </ContentLoader>
)

export default SliderSkeleton;