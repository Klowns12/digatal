import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

// Extract YouTube video ID from a URL
export function getYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title = "YouTube video player", className = "" }) => {
  if (!videoId) return null;
  
  return (
    <div className={`w-full ${className}`} style={{ position: 'relative', paddingBottom: '56.25%' }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0
        }}
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
