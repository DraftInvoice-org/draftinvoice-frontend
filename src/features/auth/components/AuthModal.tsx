import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6 mt-2">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">💎</span>
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">
                        Download Limit Reached
                    </h2>
                    <p className="text-gray-600">
                        You've reached the free guest limit of 5 downloads per hour. Create a free account to get 50 downloads per hour and save your invoices to the cloud.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        to="/signup"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Create a free account
                    </Link>
                    <Link
                        to="/login"
                        className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};
