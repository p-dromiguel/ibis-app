export default function IbisMark({ className = 'logo-mark' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id="ibis-crescent-cut">
          <rect width="64" height="64" fill="white" />
          <circle cx="32" cy="30" r="17" fill="black" />
        </mask>
      </defs>
      <circle
        cx="32"
        cy="38"
        r="20"
        fill="currentColor"
        mask="url(#ibis-crescent-cut)"
      />
      <circle cx="32" cy="30" r="7" fill="#e8b84a" />
    </svg>
  );
}
