import React from 'react';
import TriagemAI from './TriagemAI.jsx';
import SelectionView from './components/SelectionView';
import N8nChat from './components/N8nChat';

// Wrapper component that adds the new views to the existing TriagemAI
const TriagemAIEnhanced = () => {
    return <TriagemAI SelectionView={SelectionView} N8nChat={N8nChat} />;
};

export default TriagemAIEnhanced;
