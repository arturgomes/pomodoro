import { useState, useEffect } from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number, text: string, typeCounter: boolean },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', padding: '10px' }}>
      <CircularProgress variant="determinate" {...props} color={props.typeCounter ? 'success' : 'warning'} size="300px" />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          className="text-white text-6xl"
        >{`${props.text}`}</span>
      </Box>
    </Box>
  );
}

function App() {
  const [studyTime, setStudyTime] = useState(1);
  const [breakTime, setBreakTime] = useState(1);
  const [timeLeft, setTimeLeft] = useState(studyTime * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerType, setTimerType] = useState(true);
  const [showReset, setShowReset] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const startTimer = () => {
    setTimeLeft(studyTime * 60)
    setTimerActive(!timerActive);
    setShowReset(false)
  };
  const toggleTimer = () => {
    setTimerActive(!timerActive);
    setShowReset(false)
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(studyTime * 60);
    setShowReset(true)
  };

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      if (timerType) {
        handleBreakModalClose();
      } else {
        handleStudyModalClose();
      }

    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, timerType]);
  const handleBreakModalClose = () => {
    setTimerType(timerType => !timerType);
    setTimeLeft(breakTime * 60);
    setTimerActive(true);
  };

  const handleStudyModalClose = () => {
    setTimerType(timerType => !timerType);
    setTimeLeft(studyTime * 60);
    setTimerActive(true);
  };
  const roundTime = time => {
    return (time * 100) / ((!timerType ? breakTime : studyTime) * 60)
  }
  return (
    <>
      {!showReset && (<div className={`${timerType ? `bg-green-900` : `bg-orange-900`} flex items-center justify-center h-screen w-screen`}>
        <div className="w-96 flex flex-col items-center p-12">
          <h1>Pomodoro</h1>
          <div className="mt-12 flex flex-col items-center">
            <h2 className="text-6xl text-center">{timerType ? 'Tempo de Estudo' : 'Tempo de Pausa'}</h2>
            <p className="my-8">
              <CircularProgressWithLabel value={roundTime(timeLeft)} text={formatTime(timeLeft)} typeCounter={timerType} />
            </p>
            <div className="flex flex-row gap-3 justify-center">

              <button className="bg-blue-800 hover:bg-blue-600"
                onClick={toggleTimer}>{timerActive ? 'Pausar' : 'Começar'}</button>
              <button className="bg-blue-800 hover:bg-blue-600"
                onClick={resetTimer}>Resetar</button>
            </div>
          </div>
        </div>
      </div>)
      }
      {
        showReset && (<div className="bg-gray-900 p-64">
          <h1>Temporizador Pomodoro</h1>

          <div className="settings">
            <h2>Configurações</h2>
            <label>Tempo de Estudo (minutos):</label>
            <input type="number" min="1" value={studyTime} onChange={(e) => setStudyTime(parseInt(e.target.value))} />
            <label>Tempo de Pausa (minutos):</label>
            <input type="number" min="1" value={breakTime} onChange={(e) => setBreakTime(parseInt(e.target.value))} />
            <button onClick={startTimer}>Começar</button>

          </div></div>)
      }


    </ >
  );
}

export default App;
