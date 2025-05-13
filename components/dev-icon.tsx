import type React from "react"

export const DevIcon = {
  SwipeIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9 4L4 9L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4L19 9L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  WalletIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19 7V5C19 3.89543 18.1046 3 17 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H17C18.1046 21 19 20.1046 19 19V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 12H21V16H16C14.8954 16 14 15.1046 14 14C14 12.8954 14.8954 12 16 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="14" r="1" fill="currentColor" />
    </svg>
  ),

  DashboardIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
      <path d="M9 21V9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  CodeIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  BracketsIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  TerminalIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M6 10L9 12L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}
