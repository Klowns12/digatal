import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  videoId, 
  title = 'YouTube video player',
  className = ''
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="aspect-w-16 aspect-h-9 w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export const getYoutubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default YouTubeEmbed;
