import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="glass-panel w-full max-w-md p-8 relative z-10 animate-scale-in">
                <h3 className={`text-2xl font-bold mb-4 ${type === 'danger' ? 'text-red-500' : 'text-accent-cyan'}`}>
                    {title}
                </h3>

                <p className="text-slate-300 mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition-all font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${type === 'danger'
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-gradient-to-r from-accent-cyan to-accent-blue shadow-accent-cyan/20'
                            }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
