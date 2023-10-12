import React from "react";
import ContentLoader from "react-content-loader";

const Skeleton = (props) => (
  <div className="product-main__item item-product">
    <div className="item-product__body">
      <ContentLoader 
        className="skeletons"
        speed={2}
        width={300}
        height={300}
        viewBox="0 0 300 300"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="0" y="0" rx="20" ry="20" width="300" height="300" /> 
      </ContentLoader>
    </div>
  </div>
)

export default Skeleton;