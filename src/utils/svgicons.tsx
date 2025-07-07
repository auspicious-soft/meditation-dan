export const UpArrowIcon = ({ stroke = "white" }: { stroke?: string }) => (
  <div data-svg-wrapper className="relative">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10L8 6L4 10" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);
export const DownArrowIcon = ({ stroke = "white" }: { stroke?: string }) => (
  <div data-svg-wrapper className="relative">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http:www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);