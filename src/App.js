import React, { useState, useEffect } from 'react';
import image1 from './images/image1.jpg';
import image2 from './images/image2.jpg';
import './App.css';
const MAX_LIVES = 3;
const MAX_ROUNDS = 10;
const ROUND_DURATION_SECONDS = 10;

const positions = [
  { top: '80%', left: '33%' },
  { top: '80%', left: '53%' },
  { top: '80%', left: '73%' },
  { top: '100%', left: '43%' },
  { top: '100%', left: '63%' },
];

const images = [image1, image2];

function Game() {
  const [score, setScore] = useState(
    parseInt(localStorage.getItem('score')) || 0
  );
  const [lives, setLives] = useState(
    parseInt(localStorage.getItem('lives')) || MAX_LIVES
  );
  const [roundsCompleted, setRoundsCompleted] = useState(
    parseInt(localStorage.getItem('roundsCompleted')) || 0
  );
  const [currentRound, setCurrentRound] = useState(
    parseInt(localStorage.getItem('currentRound')) || 1
  );
  const [gameOver, setGameOver] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [roundOver, setRoundOver] = useState(false);
  const [positionIndex, setPositionIndex] = useState(0);
  const [targetScore, setTargetScore] = useState(
    parseInt(localStorage.getItem('targetScore')) || 10
  );
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    localStorage.setItem('score', score);
    localStorage.setItem('lives', lives);
    localStorage.setItem('roundsCompleted', roundsCompleted);
    localStorage.setItem('currentRound', currentRound);
    localStorage.setItem('targetScore', targetScore);
  }, [score, lives, roundsCompleted, currentRound, targetScore]);

  useEffect(() => {
    if (score >= targetScore) {
      if (currentRound === MAX_ROUNDS) {
        setGameOver(true);
      } else {
        setRoundsCompleted(roundsCompleted + 1);
        setCurrentRound(currentRound + 1);
        setScore(0);
        setLives(MAX_LIVES);
        setRoundOver(true);
        const nextTargetScore = Math.ceil(targetScore * 1.5); // Увеличиваем количество баллов на 50%
        setTargetScore(nextTargetScore);
        const timer = setTimeout(() => {
          setRoundOver(false);
          startRoundTimer();
        }, 5000); // 5 секунд для отображения "Конец раунда"
        return () => clearTimeout(timer);
      }
    }
  }, [score]);

  useEffect(() => {
    if (lives === 0) {
      setGameOver(true);
    }
  }, [lives]);

  useEffect(() => {
    if (gameOver) {
      // Дополнительные действия при окончании игры
      // Например, показать сообщение "Игра окончена"
    }
  }, [gameOver]);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        togglePosition();
      }, 1000); // каждую секунду меняем позицию картинки
      return () => clearInterval(interval);
    }
  }, [paused]);

  useEffect(() => {
    // Каждую секунду проверяем, нужно ли сменить активное изображение
    const interval = setInterval(() => {
      const randomIndex = Math.random() < 0.1 ? 1 : 0; // 10% шанс для второй картинки
      setActiveImageIndex(randomIndex);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roundOver) {
      const timer = setTimeout(() => {
        setCurrentRound(currentRound + 1);
        setScore(0);
        setLives(MAX_LIVES);
        setTargetScore(10); // Сбрасываем количество баллов до начального значения для нового раунда
        startRoundTimer();
      }, 5000); // Задержка перед запуском нового раунда
      return () => clearTimeout(timer);
    }
  }, [roundOver]);

  const startRoundTimer = () => {
    setTimeout(() => {
      if (currentRound < MAX_ROUNDS) {
        setCurrentRound(currentRound + 1);
        setScore(0);
        setLives(MAX_LIVES);
        setTargetScore(10); // Сбрасываем количество баллов до начального значения для нового раунда
        startRoundTimer();
      } else {
        setGameOver(true);
      }
    }, ROUND_DURATION_SECONDS * 1000);
  };

  const handleCorrectClick = () => {
    if (!paused) {
      setScore(score + 1);
    }
  };

  const handlePause = () => {
    setPaused(!paused);
  };

  const handleIncorrectClick = () => {
    if (!paused && lives > 0) {
      setLives(lives - 1);
    }
  };

  const handleSecondImageClick = () => {
    if (!paused && lives > 0 && activeImageIndex === 1) {
      setLives(lives - 1);
    }
  };

  const togglePosition = () => {
    setPositionIndex((prevIndex) => (prevIndex + 1) % 5); // Переключаемся между позициями
  };

  const imgStyle = {
    position: 'absolute',
    width: '100px',
    height: '100px',
    cursor: 'pointer',
    ...positions[positionIndex], // Используем текущую позицию картинки
  };

  return (
    <div style={{ position: 'relative', width: '500px', height: '500px' }}>
      <h1>Приветствую! Нажимай на картинки, чтобы заработать баллы!</h1>
      <p>Баллы: {score}</p>
      <p>Жизни: {lives}</p>
      <p>Текущий раунд: {currentRound}</p>
      <p>Пройденные раунды: {roundsCompleted}</p>
      {roundOver ? (
        <h2>Следующий раунд начнется через 5 секунд</h2>
      ) : gameOver ? (
        <h2>Игра окончена! Пройдено раундов: {roundsCompleted}</h2>
      ) : (
        <p>Набери {targetScore} баллов, чтобы завершить этот раунд</p>
      )}{' '}
      {!roundOver && !gameOver && (
        <>
          <img
            src={images[activeImageIndex]}
            alt={`Картинка ${activeImageIndex + 1}`}
            style={imgStyle}
            onClick={
              activeImageIndex === 1
                ? handleSecondImageClick
                : handleCorrectClick
            }
          />
          <div>
            <button className="btn" onClick={handlePause}>
              {paused ? 'Возобновить' : 'Пауза'}
            </button>
          </div>
        </>
      )}
      {gameOver && <h2>Игра окончена! Пройдено раундов: {roundsCompleted}</h2>}
    </div>
  );
}

export default Game;
