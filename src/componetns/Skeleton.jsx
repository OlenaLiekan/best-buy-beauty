import React from "react";
import ContentLoader from "react-content-loader";

const Skeleton = (props) => (

  <ContentLoader 
    className="skeletons"
    speed={2}
    width={220}
    height={260}
    viewBox="0 0 220 260"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="20" ry="20" width="220" height="200" /> 
    <rect x="0" y="220" rx="20" ry="20" width="110" height="40" /> 
    <rect x="140" y="220" rx="20" ry="20" width="80" height="40" />
  </ContentLoader>
)

export default Skeleton;