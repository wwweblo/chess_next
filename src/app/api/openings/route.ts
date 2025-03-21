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

// 📌 Получение всех записей
export async function GET() {
  const db = await connectDB();
  const openings = await db.all("SELECT * FROM openings");
  await db.close();
  return NextResponse.json(openings);
}

// 📌 Добавление новой позиции
export async function POST(req: Request) {
  const { nameEn, nameRu, fen } = await req.json();
  const db = await connectDB();
  const result = await db.run(
    "INSERT INTO openings (nameEn, nameRu, fen) VALUES (?, ?, ?)",
    [nameEn, nameRu, fen]
  );
  const newOpening = { id: result.lastID, nameEn, nameRu, fen };
  await db.close();
  return NextResponse.json(newOpening, { status: 201 });
}
