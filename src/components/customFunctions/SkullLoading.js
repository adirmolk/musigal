import React from "react";
import ContentLoader from "react-content-loader";

const SkullLoading = () => {
  return (
    <ContentLoader
      speed={3}
      width={432}
      height={400}
      viewBox="0 0 370 370"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="15" y="15" rx="4" ry="4" width="50" height="50" />
      <rect x="80" y="25" rx="2" ry="2" width="120" height="10" />
      <rect x="80" y="45" rx="2" ry="2" width="80" height="10" />

      <circle cx="400" cy="40" r="20" />
      <rect x="15" y="80" rx="4" ry="4" width="400" height="10" />
      <rect x="15" y="105" rx="4" ry="4" width="300" height="10" />
      <rect x="15" y="130" rx="4" ry="4" width="350" height="10" />

      <circle cx="400" cy="220" r="20" />
      <rect x="15" y="165" rx="4" ry="4" width="400" height="10" />
      <rect x="15" y="190" rx="4" ry="4" width="300" height="10" />
      <rect x="15" y="215" rx="4" ry="4" width="350" height="10" />

      <circle cx="400" cy="400" r="20" />
      <rect x="15" y="260" rx="4" ry="4" width="400" height="10" />
      <rect x="15" y="285" rx="4" ry="4" width="300" height="10" />
      <rect x="15" y="310" rx="4" ry="4" width="350" height="10" />
    </ContentLoader>
  );
};

export default SkullLoading;
