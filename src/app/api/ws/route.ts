import { WebSocketServer } from "ws";
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";
import { Socket } from "net";

const rooms: Record<string, { players: number; moves: string[] }> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) {
    res.status(500).json({ error: "WebSocket поддерживается только в серверной среде" });
    return;
  }

  if (!(res.socket as any).server.wss) {
    const wss = new WebSocketServer({ noServer: true });

    (res.socket as any).server.on("upgrade", (request: IncomingMessage, socket: Socket, head: Buffer) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });

    wss.on("connection", (ws, request) => {
      const url = new URL(request.url || "", `http://${request.headers.host}`);
      const roomId = url.searchParams.get("roomId");

      if (!roomId) {
        ws.close();
        return;
      }

      if (!rooms[roomId]) {
        rooms[roomId] = { players: 0, moves: [] };
      }

      rooms[roomId].players++;

      ws.send(JSON.stringify({ type: "init", moves: rooms[roomId].moves }));

      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message.toString());
          if (data.type === "move") {
            rooms[roomId].moves.push(data.move);
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === 1) {
                client.send(JSON.stringify({ type: "move", move: data.move }));
              }
            });
          }
        } catch (error) {
          console.error("Ошибка обработки сообщения:", error);
        }
      });

      ws.on("close", () => {
        rooms[roomId].players--;
        if (rooms[roomId].players === 0) {
          delete rooms[roomId];
        }
      });
    });

    (res.socket as any).server.wss = wss;
  }

  res.end();
}
