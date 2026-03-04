import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export type TipConfirmedEvent = {
  creatorId: string;
  amount: number;
  supporterName: string;
  message?: string | null;
  tipId: string;
  createdAt: string;
};

let io: Server | null = null;

export function initAlertsSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: "*"
    },
    path: "/alerts"
  });

  io.on("connection", (socket) => {
    socket.on("alerts:subscribe", (creatorId: string) => {
      socket.join(`creator:${creatorId}`);
    });
  });

  return io;
}

export function emitTipConfirmed(event: TipConfirmedEvent): void {
  io?.to(`creator:${event.creatorId}`).emit("tip:confirmed", event);
}