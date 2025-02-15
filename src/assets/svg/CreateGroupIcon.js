const CreateGroupIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        cx="9"
        cy="9"
        r="3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      ></circle>
      <path
        stroke="currentColor"
        strokeWidth="2"
        d="M12.268 9a2 2 0 113.464 2 2 2 0 01-3.464-2h0z"
      ></path>
      <path
        fill="currentColor"
        d="M13.882 19l-.98.197.16.803h.82v-1zm3.838-1.096l.943-.334-.943.334zm-5.94-2.194l-.604-.796-1.157.879 1.234.767.528-.85zM16.868 18h-2.985v2h2.985v-2zm-.09.238a.21.21 0 01-.005-.103.218.218 0 01.043-.097c.032-.04.059-.038.052-.038v2c1.146 0 2.274-1.08 1.796-2.43l-1.885.668zM14 16c1.642 0 2.403 1.181 2.778 2.238l1.885-.668C18.198 16.259 16.948 14 14 14v2zm-1.614.507C12.77 16.215 13.282 16 14 16v-2c-1.162 0-2.097.362-2.824.914l1.21 1.593zm-1.133.053c1.039.646 1.474 1.772 1.648 2.637l1.96-.394c-.217-1.083-.824-2.867-2.552-3.942l-1.056 1.699z"
      ></path>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="M9 15c3.572 0 4.592 2.551 4.883 4.009.109.541-.33.991-.883.991H5c-.552 0-.992-.45-.883-.991C4.408 17.55 5.428 15 9 15zM19 3v4M21 5h-4"
      ></path>
    </svg>
  );
};

export default CreateGroupIcon;
