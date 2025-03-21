"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { v4 as uuidv4 } from "uuid";

export default function GamePage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(null);
  const [isSpectator, setIsSpectator] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(true);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [boardSize, setBoardSize] = useState(600); // Начальный размер доски
  const wsRef = useRef<WebSocket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Функция для показа ошибки на 3 секунды
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  // 🚀 Загружаем playerId ТОЛЬКО в браузере
  useEffect(() => {
    let id = localStorage.getItem("playerId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("playerId", id);
    }
    setPlayerId(id);
  }, []);

  // ✅ Безопасно получаем URL в браузере
  useEffect(() => {
    if (typeof window !== "undefined") {
      setGameUrl(window.location.href);
    }
  }, []);

  // 📏 Устанавливаем адаптивный размер доски
  useEffect(() => {
    const updateBoardSize = () => {
      const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
      setBoardSize(minSize > 600 ? 600 : minSize);
    };

    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, []);

  useEffect(() => {
    if (!roomId || !playerId) return;

    const wsProtocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:4000?roomId=${roomId}&playerId=${playerId}`;

    console.log(`🔌 Подключение к WebSocket: ${wsUrl}`);

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        console.error("❌ Ошибка:", data.error);
        if (data.error === "Игра уже заполнена") setIsSpectator(true);
        return;
      }

      if (data.type === "init") {
        setPlayerColor(data.color);
        setIsSpectator(data.color === "spectator");

        if (data.opponentConnected) {
          setWaitingForOpponent(false);
        }

        setGame(() => {
          const newGame = new Chess();
          data.moves.forEach((move: string) => {
            try {
              newGame.move(move);
            } catch (error) {
              console.warn("⚠️ Ошибка применения хода (init):", move, error);
            }
          });
          return newGame;
        });
      } else if (data.type === "move") {
        setGame((prevGame) => {
          const newGame = new Chess(prevGame.fen());
          try {
            newGame.move(data.move);
            console.log("♟️ Применен ход:", data.move);
          } catch (error) {
            console.error("❌ Невалидный ход от сервера:", data.move, error);
            return prevGame;
          }
          return newGame;
        });
      } else if (data.type === "opponent_joined") {
        setWaitingForOpponent(false);
      }
    };

    return () => socket.close();
  }, [roomId, playerId]);

  const makeMove = (move: any) => {
    if (!wsRef.current || isSpectator || game.turn() !== playerColor?.[0]) return;

    setGame((prevGame) => {
      const newGame = new Chess(prevGame.fen());

      // ✅ Проверяем валидность хода ДО его применения
      try {
        const moveResult = newGame.move(move);
        if (!moveResult) {
          throw new Error("Невозможный ход");
        }
      } catch (error) {
        console.warn("⚠️ Ошибка: невозможный ход", move);
        showError("❌ Этот ход невозможен!");
        return prevGame;
      }

      console.log(`📤 Отправка хода:`, move);
      wsRef.current?.send(JSON.stringify({ type: "move", move }));
      return newGame;
    });
  };

  // ✅ Исправленный экран ожидания с безопасным URL
  if (waitingForOpponent) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-white">Ожидание второго игрока...</h1>
        <p className="text-gray-600 mt-2">Отправьте ссылку другу, чтобы он присоединился!</p>
        {gameUrl && <p className="bg-gray-200 p-2 mt-4 rounded">{gameUrl}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {errorMessage && (
        <div className="absolute top-4 bg-red-500 text-white px-4 py-2 rounded">
          {errorMessage}
        </div>
      )}
      {playerId ? (
        <h1 className="text-white text-4xl font-bold mb-4">
          {isSpectator ? "Вы зритель" : `Вы играете за: ${playerColor}`}
        </h1>
      ) : (
        <h2 className="text-white text-xl font-bold mb-4">Загрузка...</h2>
      )}
      <div>
        <Chessboard
          position={game.fen()}
          onPieceDrop={(s, t) => {
            const move = { from: s, to: t, promotion: "q" };

            if (!isSpectator && game.turn() === playerColor?.[0]) {
              makeMove(move);
              return true;
            }

            showError("❌ Сейчас не ваш ход!");
            return false;
          }}
          boardOrientation={playerColor || "white"}
          boardWidth={boardSize}
        />
      </div>
    </div>
  );
}
