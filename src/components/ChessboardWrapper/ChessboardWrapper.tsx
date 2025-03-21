"use client";

import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

interface ChessBoardProps {
  fen: string;
  onFenChange: (fen: string) => void;
}

const ChessBoardWrapper: React.FC<ChessBoardProps> = ({ fen, onFenChange }) => {
  return (
    <Chessboard
      position={fen}
      onPieceDrop={(sourceSquare, targetSquare) => {
        const newGame = new Chess(fen);
        const move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });

        if (move) {
          onFenChange(newGame.fen());
        }
        return true;
      }}
    />
  );
};

export default ChessBoardWrapper;
