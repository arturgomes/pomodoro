import { useState, useEffect } from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number, text: string, title: string, typeCounter: boolean },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', padding: '10px' }}>
      <CircularProgress variant="determinate" {...props} color={props.typeCounter ? 'success' : 'warning'} size="600px" />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          gap: '36px',
          maxWidth: '500px',
          margin: '10%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2 className="text-5xl text-center">{props.title}</h2>
        <span
          className="text-white text-9xl font-semibold"
        >{props.text}</span>
      </Box>
    </Box >
  );
}

function App() {
  const [studyTime, setStudyTime] = useState(1);
  const [breakTime, setBreakTime] = useState(1);
  const [timeLeft, setTimeLeft] = useState(studyTime * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerType, setTimerType] = useState(true);
  const [showReset, setShowReset] = useState(true);

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
  const setTimer = (st: number, bt: number) => {
    setStudyTime(st)
    setBreakTime(bt)
  }
  const roundTime = time => {
    return (time * 100) / ((!timerType ? breakTime : studyTime) * 60)
  }
  return (
    <>
      {!showReset && (<div className={`${timerType ? `bg-green-900` : `bg-orange-900`} flex items-center justify-center h-screen w-screen`}>
        <div className="w-96 flex flex-col items-center p-12">
          <div className="mt-12 flex flex-col items-center">

            <p className="my-8">
              <CircularProgressWithLabel value={roundTime(timeLeft)} text={formatTime(timeLeft)} title={timerType ? 'Tempo de Estudo' : 'Tempo de Pausa'} typeCounter={timerType} />
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
        showReset && (<div className="bg-gray-900 p-64 flex flex-col  flex items-center justify-center h-screen w-screen">
          <h1>Temporizador Pomodoro</h1>

          <div className="flex flex-col gap-3 mt-12">

            <div>
              <h2 className="text-gray-400 text-2xl mb-2 font-bold">Predefinidos</h2>

              <div className="flex flex-row justify-between gap-1 mb-12">
                <button className="border-2 mt-4 rounded-lg border-purple-500 bg-purple-800" onClick={() => setTimer(30, 5)}>30/5</button>
                <button className="border-2 mt-4 rounded-lg border-purple-500 bg-purple-800" onClick={() => setTimer(45, 5)}>45/5</button>
                <button className="border-2 mt-4 rounded-lg border-purple-500 bg-purple-800" onClick={() => setTimer(45, 15)}>45/15</button>
                <button className="border-2 mt-4 rounded-lg border-purple-500 bg-purple-800" onClick={() => setTimer(50, 5)}>50/5</button>
                <button className="border-2 mt-4 rounded-lg border-purple-500 bg-purple-800" onClick={() => setTimer(50, 15)}>50/10</button>

              </div>
            </div>
            <h2 className="text-gray-400 text-2xl mb-2 font-bold">Configurações</h2>

            <div className="flex items-center space-between">
              <label className="flex flex-1 text-gray-400">Tempo de Estudo (minutos):</label>
              <input className="w-24 border bg-gray-800 p-2 rounded-lg text-gray-200" type="number" min="1" value={studyTime} onChange={(e) => setStudyTime(parseInt(e.target.value))} />
            </div>
            <div className="flex items-center space-between">
              <label className="flex flex-1 text-gray-400">Tempo de Pausa (minutos):</label>
              <input className=" w-24 border bg-gray-800 p-2 rounded-lg text-gray-200" type="number" min="1" value={breakTime} onChange={(e) => setBreakTime(parseInt(e.target.value))} />
            </div>
            <button className="border-2 mt-4 rounded-lg border-purple-500 bg-purple-800" onClick={startTimer}>Começar</button>

          </div></div>)
      }


    </ >
  );
}

export default App;
