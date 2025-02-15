const EmojiIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g fill="currentColor" fillRule="nonzero">
          <path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999zM8.462 14.784a.75.75 0 00-1.178.928A5.991 5.991 0 0012 18.002c1.86 0 3.581-.853 4.712-2.284a.75.75 0 00-1.177-.93A4.491 4.491 0 0112 16.502c-1.398 0-2.69-.64-3.538-1.718zM9 8.75a1.25 1.25 0 100 2.499A1.25 1.25 0 009 8.75zm6 0a1.25 1.25 0 100 2.499 1.25 1.25 0 000-2.499z"></path>
        </g>
      </g>
    </svg>
  );
};

export default EmojiIcon;
