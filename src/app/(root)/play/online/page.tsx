"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  const createGame = () => {
    const roomId = uuidv4();
    router.push(`/play/online/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Создать шахматную партию</h1>
      <button onClick={createGame} className="bg-blue-500 text-white px-4 py-2 rounded">
        Создать игру
      </button>
    </div>
  );
}
