import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // define o elemento root como o elemento pai do modal

function App() {
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(studyTime * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerType, setTimerType] = useState('estudo');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showStudyModal, setShowStudyModal] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerType('estudo');
    setTimeLeft(studyTime * 60);
  };

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      if (timerType === 'estudo') {
        setShowBreakModal(true);
      } else {
        setShowStudyModal(true);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, timerType]);

  const handleBreakModalClose = () => {
    setShowBreakModal(false);
    setTimerType('pausa');
    setTimeLeft(breakTime * 60);
    setTimerActive(true);
  };

  const handleStudyModalClose = () => {
    setShowStudyModal(false);
    setTimerType('estudo');
    setTimeLeft(studyTime * 60);
    setTimerActive(true);
  };

  return (
    <div className="App">
      <h1>Temporizador Pomodoro</h1>
      <div className="timer">
        <h2>{timerType === 'estudo' ? 'Tempo de Estudo' : 'Tempo de Pausa'}</h2>
        <p>{formatTime(timeLeft)}</p>
        <button onClick={toggleTimer}>{timerActive ? 'Pausar' : 'Começar'}</button>
        <button onClick={resetTimer}>Resetar</button>
      </div>
      <div className="settings">
        <h2>Configurações</h2>
        <label>Tempo de Estudo (minutos):</label>
        <input type="number" min="1" value={studyTime} onChange={(e) => setStudyTime(parseInt(e.target.value))} />
        <label>Tempo de Pausa (minutos):</label>
        <input type="number" min="1" value={breakTime} onChange={(e) => setBreakTime(parseInt(e.target.value))} />
      </div>
      <Modal isOpen={showBreakModal}>
        <h2>Hora da pausa!</h2>
        <p>Tire uma pausa curta e volte refrescado para a próxima sessão de estudo.</p>
        <button onClick={handleBreakModalClose}>Começar Pausa</button>
      </Modal>
      <Modal isOpen={showStudyModal}>
        <h2>Hora de Estudar!</h2>
        <p>Prepare-se para estudar novamente.</p>
        <button onClick={handleStudyModalClose}>Começar Estudo</button>
      </Modal>
    </div>
  );
}

export default App;
