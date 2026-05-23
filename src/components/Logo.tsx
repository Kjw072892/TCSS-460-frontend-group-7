'use client';

import { SxProps, Theme, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export type LogoVariant = 'full' | 'icon';

interface LogoProps {
  variant?: LogoVariant;
  width?: number | string;
  height?: number | string;
  sx?: SxProps<Theme>;
}

/**
 * App logo — concentric SVG with state-graph nodes. Pure presentation; uses
 * theme palette for the two accent colors.
 */
export default function Logo({ variant = 'full', width, height, sx }: LogoProps) {
  const theme = useTheme();
  const purple = theme.palette.secondary.main;
  const blue = theme.palette.primary.main;

  const renderFullLogo = () => (
    <>
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="white"
        opacity="0.9"
      />
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        stroke={blue}
        strokeWidth="2"
        opacity="0.3"
      />
      <circle
        cx="100"
        cy="100"
        r="20"
        fill={purple}
      />
      <circle
        cx="100"
        cy="40"
        r="12"
        fill={blue}
        opacity="0.9"
      />
      <line
        x1="100"
        y1="80"
        x2="100"
        y2="52"
        stroke={purple}
        strokeWidth="2"
        opacity="0.6"
        strokeDasharray="4 2"
      />
      <circle
        cx="160"
        cy="100"
        r="12"
        fill={blue}
        opacity="0.9"
      />
      <line
        x1="120"
        y1="100"
        x2="148"
        y2="100"
        stroke={purple}
        strokeWidth="2"
        opacity="0.6"
        strokeDasharray="4 2"
      />
      <circle
        cx="100"
        cy="160"
        r="12"
        fill={blue}
        opacity="0.9"
      />
      <line
        x1="100"
        y1="120"
        x2="100"
        y2="148"
        stroke={purple}
        strokeWidth="2"
        opacity="0.6"
        strokeDasharray="4 2"
      />
      <circle
        cx="40"
        cy="100"
        r="12"
        fill={blue}
        opacity="0.9"
      />
      <line
        x1="80"
        y1="100"
        x2="52"
        y2="100"
        stroke={purple}
        strokeWidth="2"
        opacity="0.6"
        strokeDasharray="4 2"
      />
      <circle
        cx="142"
        cy="58"
        r="8"
        fill={purple}
        opacity="0.7"
      />
      <line
        x1="115"
        y1="85"
        x2="136"
        y2="64"
        stroke={blue}
        strokeWidth="1.5"
        opacity="0.4"
      />
      <circle
        cx="142"
        cy="142"
        r="8"
        fill={purple}
        opacity="0.7"
      />
      <line
        x1="115"
        y1="115"
        x2="136"
        y2="136"
        stroke={blue}
        strokeWidth="1.5"
        opacity="0.4"
      />
      <circle
        cx="58"
        cy="142"
        r="8"
        fill={purple}
        opacity="0.7"
      />
      <line
        x1="85"
        y1="115"
        x2="64"
        y2="136"
        stroke={blue}
        strokeWidth="1.5"
        opacity="0.4"
      />
      <circle
        cx="58"
        cy="58"
        r="8"
        fill={purple}
        opacity="0.7"
      />
      <line
        x1="85"
        y1="85"
        x2="64"
        y2="64"
        stroke={blue}
        strokeWidth="1.5"
        opacity="0.4"
      />
      <circle
        cx="100"
        cy="100"
        r="6"
        fill="white"
        opacity="0.8"
      />
    </>
  );

  const renderIconLogo = () => (
    <>
      <circle
        cx="100"
        cy="100"
        r="30"
        fill={purple}
      />
      <circle
        cx="100"
        cy="50"
        r="15"
        fill={blue}
      />
      <circle
        cx="150"
        cy="100"
        r="15"
        fill={blue}
      />
      <circle
        cx="100"
        cy="150"
        r="15"
        fill={blue}
      />
      <circle
        cx="50"
        cy="100"
        r="15"
        fill={blue}
      />
      <circle
        cx="100"
        cy="100"
        r="10"
        fill="white"
        opacity="0.8"
      />
    </>
  );

  const getLogoContent = () => {
    switch (variant) {
      case 'icon':
        return renderIconLogo();
      case 'full':
      default:
        return renderFullLogo();
    }
  };

  return (
    <Box
      component="svg"
      sx={{
        width: width || 'auto',
        height: height || 'auto',
        ...sx,
      }}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {getLogoContent()}
    </Box>
  );
}
