import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import PatientPage from './pages/PatientPage';
import SelectionPage from './pages/SelectionPage';
import ChatPage from './pages/ChatPage';

import ProfessionalPage from './pages/ProfessionalPage';

export default function TriagemAI() {
  // States: 'landing', 'patient', 'selection', 'chat', 'natural_chat', 'professional'
  const [currentView, setCurrentView] = useState('landing');

  // Patient Data State
  const [patientName, setPatientName] = useState('');
  const [patientCpf, setPatientCpf] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const handleStartTriage = (e) => {
    e.preventDefault();
    if (patientName && patientCpf && patientPhone) {
      setCurrentView('selection');
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  // Render logic based on currentView
  switch (currentView) {
    case 'patient':
      return (
        <PatientPage
          setCurrentView={setCurrentView}
          patientName={patientName}
          setPatientName={setPatientName}
          patientCpf={patientCpf}
          setPatientCpf={setPatientCpf}
          patientPhone={patientPhone}
          setPatientPhone={setPatientPhone}
          handleStartTriage={handleStartTriage}
        />
      );
    case 'selection':
      return <SelectionPage setCurrentView={setCurrentView} patientName={patientName} />;
    case 'chat':
      return (
        <ChatPage
          setCurrentView={setCurrentView}
          patientName={patientName}
          patientCpf={patientCpf}
          patientPhone={patientPhone}
        />
      );
    case 'professional':
      return <ProfessionalPage setCurrentView={setCurrentView} />;
    case 'landing':
    default:
      return <LandingPage setCurrentView={setCurrentView} />;
  }
}