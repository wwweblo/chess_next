import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Подключение к базе
async function connectDB() {
  return open({
    filename: "./src/data/chess_openings.db",
    driver: sqlite3.Database,
  });
}

// 📌 Обновление позиции
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { nameEn, nameRu, fen } = await req.json();
  const db = await connectDB();
  await db.run("UPDATE openings SET nameEn = ?, nameRu = ?, fen = ? WHERE id = ?", [
    nameEn,
    nameRu,
    fen,
    params.id,
  ]);
  await db.close();
  return NextResponse.json({ message: "Позиция обновлена" });
}
