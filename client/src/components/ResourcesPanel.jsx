import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ResourceCard from './ResourceCard';
import api from '../api/axios';

const ResourcesPanel = ({ skills, phaseTitle }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (skills && skills.length > 0) {
            fetchResources();
        }
    }, [JSON.stringify(skills)]); // Stringify to avoid array reference issues

    const fetchResources = async () => {
        setLoading(true);
        setError(null);

        try {
            // Convert skills array to comma-separated string
            const skillsParam = Array.isArray(skills) ? skills.join(',') : skills;

            console.log('🔍 Fetching resources for skills:', skillsParam);

            const response = await api.get('/resources', {
                params: { skills: skillsParam }
            });

            console.log('📦 API Response:', response.data);

            if (response.data.success) {
                setResources(response.data.resources || []);
                console.log('✅ Resources loaded:', response.data.resources?.length || 0);
            }
        } catch (err) {
            console.error('❌ Failed to fetch resources:', err);
            console.error('Error details:', err.response?.data || err.message);
            setError('Unable to load resources. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Filter resources by type
    const filteredResources = filter === 'all'
        ? resources
        : resources.filter(r => r.type === filter);

    // Get unique types for filter buttons
    const availableTypes = [...new Set(resources.map(r => r.type))];

    if (loading) {
        return (
            <div className="my-12">
                <div className="glass-panel p-8 text-center">
                    <div className="spinner !my-0 !mx-auto"></div>
                    <p className="text-slate-400 mt-4">Loading learning resources...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-12">
                <div className="glass-panel p-8 text-center border-red-500/20 bg-red-500/5">
                    <p className="text-red-400">{error}</p>
                    <button onClick={fetchResources} className="btn-primary !py-2 !px-6 !text-sm mt-4">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="my-12 animate-fade-in-up">
                <div className="glass-panel p-8 text-center border-yellow-500/20 bg-yellow-500/5">
                    <span className="text-5xl mb-4 inline-block">📚</span>
                    <h3 className="text-xl font-bold text-white mb-2">No Resources Found</h3>
                    <p className="text-slate-400 mb-4">
                        We couldn't find learning resources for <span className="text-accent-cyan font-semibold">{phaseTitle}</span>
                    </p>
                    <p className="text-sm text-slate-500">
                        Try searching on YouTube or Google for tutorials on: <span className="text-accent-purple font-semibold">{skills.join(', ')}</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-12 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <span className="text-3xl">📚</span>
                        Learning Resources
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Curated resources to help you master <span className="text-accent-cyan font-semibold">{phaseTitle}</span>
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'all'
                            ? 'bg-accent-cyan text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-white/10'
                            }`}
                    >
                        All ({resources.length})
                    </button>

                    {availableTypes.map(type => {
                        const count = resources.filter(r => r.type === type).length;
                        return (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${filter === type
                                    ? 'bg-accent-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.4)]'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-white/10'
                                    }`}
                            >
                                {type}s ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Resources Carousel */}
            <div className="relative">
                {/* Gradient Fade Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none hidden md:block"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none hidden md:block"></div>

                {/* Scrollable Container */}
                <div className="overflow-x-auto pb-4 -mx-4 px-4 md:-mx-8 md:px-8 scrollbar-thin scrollbar-thumb-accent-cyan/20 scrollbar-track-slate-900/20">
                    <div className="flex gap-6">
                        {filteredResources.length > 0 ? (
                            filteredResources.map((resource, index) => (
                                <div key={`${resource.url}-${index}`} className="flex-shrink-0">
                                    <ResourceCard resource={resource} />
                                </div>
                            ))
                        ) : (
                            <div className="glass-panel p-8 text-center w-full">
                                <p className="text-slate-400">No {filter} resources found for this phase.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Resource Count Info */}
            <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                    Showing {filteredResources.length} of {resources.length} resources
                    {filter !== 'all' && ` • Filtered by: ${filter}`}
                </p>
            </div>
        </div>
    );
};

ResourcesPanel.propTypes = {
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    phaseTitle: PropTypes.string.isRequired
};

export default ResourcesPanel;
