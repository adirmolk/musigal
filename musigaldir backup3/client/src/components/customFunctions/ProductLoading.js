import React from "react";
import ContentLoader from "react-content-loader";

const ProductLoading = () => {
  return (
    <div
      className="mt-4 mx-4 rounded p-2"
      style={{
        width: "432px",
        backgroundColor: "white",
      }}
    >
      <div className="d-flex p-2 justify-content-between">
        <div className="d-flex align-items-center">
          <ContentLoader
            speed={3}
            width={50}
            height={50}
            viewBox="0 0 50 50"
            backgroundColor="#f3f3f3"
            foregroundColor="#ADD8E6"
          >
            <circle cx="25" cy="25" r="25" />
          </ContentLoader>
          <div className="mx-3">
            <ContentLoader
              speed={3}
              width={120}
              height={10}
              viewBox="0 0 120 10"
              backgroundColor="#f3f3f3"
              foregroundColor="#ADD8E6"
            >
              <rect x="0" y="0" rx="4" ry="4" width="120" height="10" />
            </ContentLoader>
            <br/>
            <ContentLoader
              speed={3}
              width={80}
              height={10}
              viewBox="0 0 80 10"
              backgroundColor="#f3f3f3"
              foregroundColor="#ADD8E6"
            >
              <rect x="0" y="0" rx="4" ry="4" width="80" height="10" />
            </ContentLoader>
          </div>
        </div>
        <button
          style={{ backgroundColor: "#DDC7A9" }}
          className="btn badge fw-bold fs-5 h-50 mt-2"
        >
          +
        </button>
      </div>
      <hr />

      <div className="p-3 rounded">
        <ContentLoader
          speed={3}
          width={300}
          height={300}
          viewBox="0 0 300 300"
          backgroundColor="#f3f3f3"
          foregroundColor="#ADD8E6"
        >
          <rect x="0" y="0" rx="4" ry="4" width="300" height="300" />
        </ContentLoader>

    <div className="mx-3 d-flex flex-column align-items-start">
  <span className="fw-bold">
    <ContentLoader
      speed={3}
      width={100}
      height={10}
      viewBox="0 0 100 10"
      backgroundColor="#f3f3f3"
      foregroundColor="#ADD8E6"
    >
      <rect x="0" y="0" rx="4" ry="4" width="100" height="10" />
    </ContentLoader>&#8226;
    <span style={{ color: "lightblue" }}>
    <ContentLoader
      speed={3}
      width={80}
      height={10}
      viewBox="0 0 80 10"
      backgroundColor="#f3f3f3"
      foregroundColor="#ADD8E6"
    >
      <rect x="0" y="0" rx="4" ry="4" width="80" height="10" />
    </ContentLoader>
  </span>
  </span>
 
  

  <span className="">
    <ContentLoader
      speed={3}
      width={30}
      height={10}
      viewBox="0 0 30 10"
      backgroundColor="#f3f3f3"
      foregroundColor="#ADD8E6"
    >
      <rect x="0" y="0" rx="4" ry="4" width="30" height="10" />
    </ContentLoader>
    $
    <ContentLoader
      speed={3}
      width={30}
      height={10}
      viewBox="0 0 30 10"
      backgroundColor="#f3f3f3"
      foregroundColor="#ADD8E6"
    >
      <rect x="0" y="0" rx="4" ry="4" width="30" height="10" />
    </ContentLoader>
   
   
  </span>
  
  <div>
    <button
      style={{ backgroundColor: "lightblue" }}
      className="btn mt-1"
    >
      <ContentLoader
        speed={3}
        width={50}
        height={20}
        viewBox="0 0 50 20"
        backgroundColor="#f3f3f3"
        foregroundColor="#ADD8E6"
      >
        <rect x="0" y="0" rx="4" ry="4" width="50" height="20" />
      </ContentLoader>
    </button>
    <button
      style={{ backgroundColor: "lightblue" }}
      className="ms-2 btn mt-1"
    >
      <ContentLoader
        speed={3}
        width={120}
        height={20}
        viewBox="0 0 120 20"
        backgroundColor="#f3f3f3"
        foregroundColor="#ADD8E6"
      >
        <rect x="0" y="0" rx="4" ry="4" width="120" height="20" />
      </ContentLoader>
    </button>
  </div>
</div>

        </div>
      </div>
   
  );
};

export default ProductLoading;
