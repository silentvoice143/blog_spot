import React from "react";

function WriteIcon({ height = 20, width = 20, color = "black" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.9883 1.74166C17.4225 1.95 17.935 2.25166 18.3425 2.65916C18.7508 3.0675 19.0525 3.57916 19.2592 4.01333C19.52 4.55833 19.3508 5.18666 18.925 5.61333L12.9133 11.6242C12.655 11.8825 12.34 12.075 11.9925 12.1867L8.47417 13.3142C8.36474 13.3493 8.24775 13.3535 8.13606 13.3264C8.02437 13.2994 7.9223 13.242 7.84108 13.1607C7.75987 13.0794 7.70264 12.9773 7.67569 12.8656C7.64874 12.7539 7.65311 12.6369 7.68833 12.5275L8.81583 9.01C8.92713 8.66274 9.11968 8.34705 9.3775 8.08916L15.3892 2.0775C15.8158 1.65083 16.4442 1.4825 16.9892 1.7425L16.9883 1.74166ZM17.1642 3.83833C16.9583 3.64387 16.726 3.47947 16.4742 3.35L10.6458 9.17833C10.5866 9.23746 10.5366 9.30516 10.4975 9.37916L9.25 11.7517L11.6217 10.505C11.6967 10.4658 11.7642 10.4158 11.8233 10.3567L17.6517 4.52833C17.5222 4.27649 17.3586 4.0442 17.1642 3.83833ZM5.16583 4.58333C5.16565 4.47689 5.20622 4.37441 5.27921 4.29693C5.35219 4.21945 5.45207 4.17284 5.55833 4.16666L10.1667 4.17083C10.3877 4.17083 10.5996 4.08303 10.7559 3.92675C10.9122 3.77047 11 3.55851 11 3.3375C11 3.11648 10.9122 2.90452 10.7559 2.74824C10.5996 2.59196 10.3877 2.50416 10.1667 2.50416L5.58333 2.5C5.0308 2.5 4.50089 2.71949 4.11019 3.11019C3.71949 3.50089 3.5 4.0308 3.5 4.58333V15.0642C3.5 15.6975 3.56833 16.0517 3.76583 16.42C3.9525 16.7692 4.23083 17.0483 4.58 17.235C4.94833 17.4317 5.30167 17.5 5.93583 17.5H16.0642C16.6975 17.5 17.0517 17.4317 17.42 17.235C17.77 17.0483 18.0483 16.7692 18.235 16.42C18.4317 16.0517 18.5 15.6983 18.5 15.0642V10.8333C18.5 10.6123 18.4122 10.4004 18.2559 10.2441C18.0996 10.0878 17.8877 10 17.6667 10C17.4457 10 17.2337 10.0878 17.0774 10.2441C16.9211 10.4004 16.8333 10.6123 16.8333 10.8333V15.0642C16.8333 15.4467 16.8158 15.54 16.765 15.6342C16.7361 15.6903 16.6903 15.7361 16.6342 15.765C16.54 15.815 16.4467 15.8333 16.0642 15.8333H5.93583C5.55333 15.8333 5.46083 15.815 5.36583 15.765C5.30963 15.7361 5.26388 15.6904 5.235 15.6342C5.185 15.54 5.16667 15.4467 5.16667 15.0642L5.16583 4.58333Z"
        fill="black"
      />
    </svg>
  );
}

export default WriteIcon;
