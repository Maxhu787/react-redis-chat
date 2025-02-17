const CircleFlagsTw = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
    >
      <mask id="circleFlagsTw0">
        <circle cx="256" cy="256" r="256" fill="#fff"></circle>
      </mask>
      <g mask="url(#circleFlagsTw0)">
        <path fill="#d80027" d="M0 256L256 0h256v512H0z"></path>
        <path fill="#0052b4" d="M256 256V0H0v256z"></path>
        <path
          fill="#eee"
          d="m222.6 149.8l-31.3 14.7l16.7 30.3l-34-6.5l-4.3 34.3l-23.6-25.2l-23.7 25.2l-4.3-34.3l-34 6.5l16.7-30.3l-31.2-14.7l31.2-14.7l-16.6-30.3l34 6.5l4.2-34.3l23.7 25.3L169.7 77l4.3 34.3l34-6.5l-16.7 30.3z"
        ></path>
        <circle cx="146.1" cy="149.8" r="47.7" fill="#0052b4"></circle>
        <circle cx="146.1" cy="149.8" r="41.5" fill="#eee"></circle>
      </g>
    </svg>
  );
};

export default CircleFlagsTw;
