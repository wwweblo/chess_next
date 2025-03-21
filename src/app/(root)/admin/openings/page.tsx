"use client";

import { useState, useEffect } from "react";
import ChessBoard from "@/components/ChessboardWrapper";
import PositionControls from "@/components/PositionControls";
import Loader from "@/components/loader";

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // Начальная позиция

const ChessPage = () => {
  const [fen, setFen] = useState<string>(startFen);
  const [positionNameEn, setPositionNameEn] = useState<string>("");
  const [positionNameRu, setPositionNameRu] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonVariant, setButtonVariant] = useState<"neutral" | "decline" | "agree">("neutral");
  const [buttonText, setButtonText] = useState<string>("💾 Сохранить позицию");
  const [positionId, setPositionId] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // 🚀 Функция загрузки названия позиции по FEN
  const fetchPosition = async (fen: string) => {
    setLoading(true);
    setApiError(null);

    try {
      console.log(`🔍 Запрос к API: /api/openings/search`);
      const response = await fetch("/api/openings/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen }),
      });

      const data = await response.json();
      console.log("📩 Ответ API:", data);

      if (response.ok && data.name_en) {
        setPositionId(data.id);
        setPositionNameEn(data.name_en);
        setPositionNameRu(data.name_ru);
        setButtonVariant("neutral");
        setButtonText("💾 Сохранить позицию");
      } else {
        console.warn(`⚠️ API не нашёл запись для FEN: ${fen}`);
        setPositionId(null);
        setButtonVariant("decline");
        setButtonText("💾 Сохранить позицию");
      }
    } catch (error) {
      console.error("❌ Ошибка запроса к API:", error);
      setApiError("Ошибка загрузки позиции. Проверьте консоль.");
    }

    setLoading(false);
  };

  // 📌 Загружаем стартовую позицию при первой загрузке
  useEffect(() => {
    fetchPosition(startFen);
  }, []);

  // 🔄 Вызываем `fetchPosition` при каждом изменении `fen`
  useEffect(() => {
    if (fen !== startFen) {
      fetchPosition(fen);
    }
  }, [fen]);

  // 📝 Функция сохранения или обновления позиции
  const savePosition = async () => {
    if (!fen || (!positionNameEn && !positionNameRu)) return;

    try {
      console.log(`💾 Проверка, есть ли запись в базе для FEN: ${fen}`);
      const responseCheck = await fetch("/api/openings/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen }),
      });

      const dataCheck = await responseCheck.json();
      console.log("📌 Ответ на проверку существующей записи:", dataCheck);

      if (dataCheck.id) {
        console.log(`🔄 Обновление записи ID: ${dataCheck.id}`);
        await fetch(`/api/openings/${dataCheck.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name_en: positionNameEn, name_ru: positionNameRu, fen }),
        });
        setButtonVariant("agree");
        setButtonText("🔄 Обновлено");
      } else {
        console.log(`🆕 Создание новой записи для FEN: ${fen}`);
        await fetch("/api/openings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name_en: positionNameEn, name_ru: positionNameRu, fen }),
        });
        setButtonVariant("agree");
        setButtonText("✅ Сохранено");
      }
    } catch (error) {
      console.error("❌ Ошибка сохранения позиции:", error);
      setApiError("Ошибка сохранения. Проверьте консоль.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <ChessBoard fen={fen} onFenChange={setFen} />
      <PositionControls {...{ positionNameEn, positionNameRu, setPositionNameEn, setPositionNameRu, onSave: savePosition, buttonVariant, buttonText }} />
      <Loader loading={loading} />
    </div>
  );
};

export default ChessPage;
