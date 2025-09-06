import React from 'react';

interface GrafanaEmbedProps {
  /** Full URL to the Grafana dashboard or panel to embed */
  dashboardUrl: string;
  /** Width of the iframe (e.g. '100%', '800px') */
  width?: string;
  /** Height of the iframe (e.g. '600px') */
  height?: string;
}

const GrafanaEmbed: React.FC<GrafanaEmbedProps> = ({ dashboardUrl, width = '100%', height = '600px' }) => {
  return (
    <iframe
      src={dashboardUrl}
      width={width}
      height={height}
      frameBorder="0"
      allowFullScreen
    />
  );
};

export default GrafanaEmbed;
