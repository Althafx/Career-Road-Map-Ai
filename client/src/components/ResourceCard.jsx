import { useState } from 'react';
import PropTypes from 'prop-types';

const ResourceCard = ({ resource }) => {
    const [imageError, setImageError] = useState(false);

    // Type icon mapping
    const getTypeIcon = (type) => {
        const icons = {
            video: '🎥',
            playlist: '📺',
            documentation: '📚',
            course: '🎓',
            article: '📄',
            github: '⭐'
        };
        return icons[type] || '🔗';
    };

    // Difficulty badge colors
    const getDifficultyColor = (difficulty) => {
        const colors = {
            beginner: 'bg-green-500/20 text-green-400 border-green-500',
            intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
            advanced: 'bg-red-500/20 text-red-400 border-red-500'
        };
        return colors[difficulty] || colors.beginner;
    };

    // Fallback thumbnail
    const defaultThumbnail = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect fill='%230f172a' width='200' height='120'/%3E%3Ctext x='50%25' y='50%25' fill='%2300f3ff' text-anchor='middle' dy='.3em' font-size='40'%3E${getTypeIcon(resource.type)}%3C/text%3E%3C/svg%3E`;

    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
        >
            <div className="glass-panel p-4 h-full flex flex-col hover:border-accent-cyan transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] cursor-pointer min-w-[280px] max-w-[320px]">
                {/* Thumbnail */}
                <div className="relative mb-4 rounded-xl overflow-hidden bg-slate-800 h-40">
                    <img
                        src={imageError ? defaultThumbnail : (resource.thumbnail || defaultThumbnail)}
                        alt={resource.title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="text-white text-sm font-semibold flex items-center gap-2">
                            Open Resource
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    {/* Type & Duration */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-accent-cyan font-semibold uppercase tracking-wider flex items-center gap-1">
                            {getTypeIcon(resource.type)} {resource.type}
                        </span>
                        {resource.duration && (
                            <span className="text-xs text-slate-400">{resource.duration}</span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold mb-2 line-clamp-2 group-hover:text-accent-cyan transition-colors">
                        {resource.title}
                    </h3>

                    {/* Description */}
                    {resource.description && (
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2 flex-1">
                            {resource.description}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                        {/* Author */}
                        {resource.author && (
                            <span className="text-xs text-slate-500 truncate max-w-[60%]">
                                by {resource.author}
                            </span>
                        )}

                    </div>

                 
                </div>
            </div>
        </a>
    );
};

ResourceCard.propTypes = {
    resource: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        url: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        difficulty: PropTypes.string,
        duration: PropTypes.string,
        thumbnail: PropTypes.string,
        author: PropTypes.string,
        rating: PropTypes.number
    }).isRequired
};

export default ResourceCard;
