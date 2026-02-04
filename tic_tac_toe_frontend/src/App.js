import React, { useMemo, useState } from "react";
import "./App.css";

const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function App() {
  /** This is the main entry UI for the Tic Tac Toe game. */
  const [squares, setSquares] = useState(Array(9).fill(null)); // "X" | "O" | null
  const [xIsNext, setXIsNext] = useState(true);

  const analysis = useMemo(() => {
    const winnerInfo = calculateWinner(squares);
    const winner = winnerInfo?.winner ?? null;
    const winningLine = winnerInfo?.line ?? null;

    const isDraw = !winner && squares.every((v) => v !== null);

    const nextPlayer = xIsNext ? "X" : "O";

    let statusText = `Next: ${nextPlayer}`;
    if (winner) statusText = `Winner: ${winner}`;
    if (isDraw) statusText = "Draw";

    return { winner, winningLine, isDraw, statusText, nextPlayer };
  }, [squares, xIsNext]);

  const handleSquareClick = (index) => {
    // Ignore if game is over or square is already filled.
    if (analysis.winner || analysis.isDraw || squares[index]) return;

    setSquares((prev) => {
      const copy = prev.slice();
      copy[index] = xIsNext ? "X" : "O";
      return copy;
    });
    setXIsNext((prev) => !prev);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const isGameOver = Boolean(analysis.winner) || analysis.isDraw;

  return (
    <div className="App">
      <main className="ttt-shell">
        <header className="ttt-header">
          <div className="ttt-badge" aria-hidden="true">
            8-BIT
          </div>
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Two players. One grid. Retro vibes.</p>
        </header>

        <section className="ttt-panel" aria-label="Game panel">
          <div className="ttt-statusRow" aria-live="polite">
            <div className="ttt-status" role="status">
              {analysis.statusText}
            </div>
            <div className="ttt-mini">
              X starts • {isGameOver ? "Game over" : "Playing"}
            </div>
          </div>

          <div
            className="ttt-board"
            role="grid"
            aria-label="Tic Tac Toe board"
          >
            {squares.map((value, idx) => {
              const isWinning =
                analysis.winningLine?.includes(idx) ?? false;

              const isDisabled = Boolean(value) || isGameOver;

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt-square",
                    value ? "is-filled" : "",
                    isWinning ? "is-winning" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `: ${value}` : ""}`}
                >
                  <span className="ttt-mark" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt-actions">
            <button type="button" className="ttt-btn" onClick={resetGame}>
              Reset
            </button>
          </div>

          <footer className="ttt-help" aria-label="Help">
            <div className="ttt-kbd">
              Tip: Click an empty square to place your mark.
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Determine the winner for a Tic Tac Toe board.
   * @param {Array<("X"|"O"|null)>} squares - The 9-square board array.
   * @returns {{winner: "X"|"O", line: number[]} | null} Winner info with winning line indices, or null.
   */
  for (const [a, b, c] of LINES) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return null;
}

export default App;
