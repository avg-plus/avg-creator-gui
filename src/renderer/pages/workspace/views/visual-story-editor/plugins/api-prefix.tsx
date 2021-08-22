import React from "react";

interface APIPrefixParams {
  type: "API";
}

export const APIPrefix = (params: APIPrefixParams) => {
  return (
    <>
      {params.type === "API" && (
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2001"
          width="200"
          height="200"
        >
          <path
            d="M805.7 451.8h-55.3c-68.6-0.1-146.7-0.3-146.7-0.3l88.5-322.7v-10.4c0-5.2-5.2-10.4-10.4-15.6-10.4-10.4-26-10.4-36.4 0L130.1 540c-5.2 5.2-4.2 19.6-4.2 19.6s-1 6.4 4.2 11.6c5.2 5.2 10.4 5.2 20.8 5.2h270.7l-88.5 317.5v5.2c-5.2 10.4 0 15.6 5.2 20.8 5.2 5.2 10.4 5.2 20.8 5.2 5.2 0 15.6 0 20.8-5.2l515.3-437.3c5.2-5.2 6.2-10.6 6.2-15.9s-5.4-10.3-9-12.1c-3.5-1.8-7-2.1-38.3-2.1"
            fill="#00AA88"
            p-id="2002"
            data-spm-anchor-id="a313x.7781069.0.i0"
          ></path>
        </svg>
      )}
    </>
  );
};
