"use client";

import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { LineChart, Line, CartesianGrid, Dot, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"; // Import the necessary components
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Card components for chart container
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button"; // Import the Button component

const STOCKFISH_PATH = "/stockfish/stockfish.wasm.js"; // Stockfish path

const ChessPage = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [stockfish, setStockfish] = useState<Worker | null>(null);
  const [evaluation, setEvaluation] = useState(0); // Evaluation of the current position
  const [depth, setDepth] = useState(10); // Depth for Stockfish
  const [history, setHistory] = useState<number[]>([]); // History of evaluations
  const [currentMove, setCurrentMove] = useState(0); // For syncing with chart
  const [boardSize, setBoardSize] = useState(500); // Board size
  const [isBotThinking, setIsBotThinking] = useState(false); // Bot thinking flag

  // 📏 Responsive board size
  useEffect(() => {
    const updateBoardSize = () => {
      const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
      setBoardSize(minSize > 600 ? 600 : minSize);
    };

    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, []);

  // 🏁 Initialize Stockfish engine
  useEffect(() => {
    const engine = new Worker(STOCKFISH_PATH);
    engine.postMessage("uci");
    setStockfish(engine);

    return () => {
      engine.terminate();
    };
  }, []);

  // 🎯 Update evaluation after move
  const updateEvaluation = useCallback(() => {
    if (!stockfish || game.isGameOver()) return;

    stockfish.postMessage(`position fen ${game.fen()}`);
    stockfish.postMessage(`go depth ${depth}`);

    stockfish.onmessage = (event) => {
      const response = event.data;
      if (response.includes("score cp")) {
        const match = response.match(/score cp (-?\d+)/);
        if (match) {
          const evalValue = parseInt(match[1], 10) / 100;

          // 📌 Update history for each move
          setHistory((prev) => [...prev.slice(0, currentMove), evalValue]);
          setEvaluation(evalValue);
        }
      }
    };
  }, [game, stockfish, depth, currentMove]);

  // 🤖 Bot makes a move
  const makeBotMove = useCallback(() => {
    if (!stockfish || game.isGameOver()) return;

    setIsBotThinking(true);

    stockfish.postMessage(`position fen ${game.fen()}`);
    stockfish.postMessage(`go depth ${depth}`);

    stockfish.onmessage = (event) => {
      const response = event.data;
      if (response.includes("bestmove")) {
        const bestMove = response.split("bestmove ")[1].split(" ")[0];

        if (bestMove && bestMove.length >= 4) {
          game.move({ from: bestMove.substring(0, 2), to: bestMove.substring(2, 4), promotion: "q" });
          setFen(game.fen());
          setCurrentMove((prev) => prev + 1);
          updateEvaluation(); // Update evaluation after move
        }
        setIsBotThinking(false);
      }
    };
  }, [game, stockfish, depth, updateEvaluation]);

  // 👤 Player makes a move
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (isBotThinking) return false; // Prevent moves while the bot is thinking

    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (!move) return false;

    setFen(game.fen());
    setCurrentMove((prev) => prev + 1);
    updateEvaluation(); // Update evaluation after move
    setTimeout(makeBotMove, 500);
    return true;
  };

  // ⏪ Undo move
  const undoMove = () => {
    if (game.history().length > 0) {
      game.undo();
      setFen(game.fen());
      setCurrentMove((prev) => Math.max(0, prev - 1)); // Decrease the current move count
    }
  };

  // 📊 Chart data
  const evaluationData = history.map((score, index) => ({
    name: `Move ${index + 1}`,
    score,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ background: "transparent" }}>
      <h1 className="text-2xl font-bold mb-4">Chess Game with Bot (Stockfish)</h1>

      {/* Difficulty Level Selection */}
      <select
        onChange={(e) => setDepth(Number(e.target.value))}
        value={depth}
        className="mb-4 p-2 border rounded"
      >
        <option value="5">Beginner</option>
        <option value="10">Intermediate</option>
        <option value="15">Advanced</option>
      </select>

      {/* Chessboard */}
      <div style={{ width: boardSize, height: boardSize }}>
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardWidth={boardSize}
          animationDuration={300}
        />
      </div>

      {/* Undo Button */}
      <Button
        className="mt-4 p-2"
        variant="secondary"
        size="default"
        onClick={undoMove}
      >
        ⏪ Undo Move
      </Button>

      {/* Position Evaluation */}
      <div className="w-full max-w-md mt-4">
        <div className="text-center mb-2">Position Evaluation: {evaluation.toFixed(2)}</div>

        {/* Card containing the chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={evaluationData}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChessPage;
