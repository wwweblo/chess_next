import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// 📌 Функция подключения к базе
async function connectDB() {
  return open({
    filename: "./src/data/chess_openings.db",
    driver: sqlite3.Database,
  });
}

// 📌 API поиска по FEN (POST /api/openings/search)
export async function POST(req: Request) {
  try {
    const { fen } = await req.json();

    if (!fen) {
      return NextResponse.json({ error: "Не указан FEN-код" }, { status: 400 });
    }

    console.log(`🔍 Поиск записи с FEN: ${fen}`);

    const db = await connectDB();
    const result = await db.get("SELECT id, name_en, name_ru FROM openings WHERE fen = ?", [fen]);
    await db.close();

    if (!result) {
      console.warn(`⚠️ Запись с FEN не найдена: ${fen}`);
      return NextResponse.json({ message: "Запись не найдена" }, { status: 404 });
    }

    console.log(`✅ Найдена запись:`, result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Ошибка при поиске в базе:", error);
    return NextResponse.json({ error: "Ошибка при поиске" }, { status: 500 });
  }
}
