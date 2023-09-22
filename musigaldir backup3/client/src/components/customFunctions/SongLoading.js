import React from "react";
import ContentLoader from "react-content-loader";

const SongLoading = () => {
  return (
    <div className="mt-4 mx-4 p-2 rounded" style={{ backgroundColor: "white", width: "400px" }}>
      <div className="p-2 justify-content-evenly">
        <div className="d-flex align-items-center mb-3">
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
          <div className="mx-3 mb-1">
            <ContentLoader
              speed={3}
              width={180}
              height={10}
              viewBox="0 0 180 10"
              backgroundColor="#f3f3f3"
              foregroundColor="#ADD8E6"
            >
              <rect x="0" y="0" rx="4" ry="4" width="120" height="10" />
            </ContentLoader>
            <br />
            <ContentLoader
              speed={3}
              width={160}
              height={10}
              viewBox="0 0 160 10"
              backgroundColor="#f3f3f3"
              foregroundColor="#ADD8E6"
            >
              <rect x="0" y="0" rx="4" ry="4" width="100" height="10" />
            </ContentLoader>
          </div>
        </div>
        <div
          className="instagram-post rounded"
          style={{
            width: "365px",
            marginBottom: "20px",
            position: "relative",
            borderRadius: "10px",
            margin: "0 auto",
          }}
        >
          <ContentLoader
            speed={3}
            width={365}
            height={365}
            viewBox="0 0 365 365"
            backgroundColor="#f3f3f3"
            foregroundColor="#ADD8E6"
          >
            <rect x="0" y="0" rx="4" ry="4" width="365" height="365" />
          </ContentLoader>
          <div
            className="text-center"
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "#DDC7A9",
              padding: "10px",
              borderRadius: "0 0 5px 5px",
            }}
          >
            <ContentLoader
              speed={3}
              width={150}
              height={16}
              viewBox="0 0 150 16"
              backgroundColor="#f3f3f3"
              foregroundColor="#ADD8E6"
            >
              <rect x="0" y="0" rx="4" ry="4" width="150" height="16" />
            </ContentLoader>
            <br />
            <ContentLoader
              speed={3}
              width={100}
              height={14}
              viewBox="0 0 100 14"
              backgroundColor="#f3f3f3"
              foregroundColor="#ADD8E6"
            >
              <rect x="0" y="0" rx="4" ry="4" width="100" height="14" />
            </ContentLoader>
          </div>
        </div>

        <div className="d-flex flex-column justify-content-start align-items-start">
          <div>
            <ContentLoader
              speed={3}
              width={150}
              height={20}
              viewBox="0 0 150 20"
              backgroundColor="#f3f3f3"
              foregroundColor="#ADD8E6"
            >
              <rect x="0" y="0" rx="4" ry="4" width="100" height="25" />
            </ContentLoader>
          </div>

          <div>
            <ContentLoader
              speed={3}
              width={365}
              height={10}
              viewBox="0 0 365 10"
              backgroundColor="#f3f3f3"
              foregroundColor="#ADD8E6"
            >
              <rect x="0" y="0" rx="4" ry="4" width="100" height="10" />
            </ContentLoader>
          </div>


        </div>
      </div>
    </div>
  );
};

export default SongLoading;
