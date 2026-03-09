import { useState, useEffect } from 'react';

export const useWalkthrough = () => {
    const [showWalkthrough, setShowWalkthrough] = useState(false);

    useEffect(() => {
        const isComplete = localStorage.getItem('editorWalkthroughComplete');
        if (!isComplete) {
            setShowWalkthrough(true);
        }
    }, []);

    const completeWalkthrough = () => {
        localStorage.setItem('editorWalkthroughComplete', 'true');
        setShowWalkthrough(false);
    };

    return { showWalkthrough, completeWalkthrough };
};
