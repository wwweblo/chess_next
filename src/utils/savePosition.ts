export const checkPositionExists = async (fen: string) => {
    try {
      console.log(`💾 Проверка, есть ли запись в базе для FEN: ${fen}`);
      const response = await fetch("/api/openings/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen }),
      });
  
      const data = await response.json();
      console.log("📌 Ответ на проверку существующей записи:", data);
  
      return data.id ? data : null;
    } catch (error) {
      console.error("❌ Ошибка проверки позиции:", error);
      return null;
    }
  };
  
  export const updatePosition = async (id: number, nameEn: string, nameRu: string, fen: string) => {
    try {
      console.log(`🔄 Обновление записи ID: ${id}`);
      await fetch(`/api/openings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name_en: nameEn, name_ru: nameRu, fen }),
      });
  
      return true;
    } catch (error) {
      console.error("❌ Ошибка обновления позиции:", error);
      return false;
    }
  };
  
  export const createPosition = async (nameEn: string, nameRu: string, fen: string) => {
    try {
      console.log(`🆕 Создание новой записи для FEN: ${fen}`);
      await fetch("/api/openings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name_en: nameEn, name_ru: nameRu, fen }),
      });
  
      return true;
    } catch (error) {
      console.error("❌ Ошибка создания позиции:", error);
      return false;
    }
  };
  
  // 📝 Основная функция сохранения позиции
  export const savePosition = async (
    fen: string,
    positionNameEn: string,
    positionNameRu: string,
    setButtonVariant: (variant: "neutral" | "decline" | "agree") => void,
    setButtonText: (text: string) => void,
    setApiError: (error: string | null) => void
  ) => {
    if (!fen || (!positionNameEn && !positionNameRu)) return;
  
    try {
      const existingPosition = await checkPositionExists(fen);
  
      if (existingPosition) {
        const updated = await updatePosition(existingPosition.id, positionNameEn, positionNameRu, fen);
        if (updated) {
          setButtonVariant("agree");
          setButtonText("🔄 Обновлено");
        }
      } else {
        const created = await createPosition(positionNameEn, positionNameRu, fen);
        if (created) {
          setButtonVariant("agree");
          setButtonText("✅ Сохранено");
        }
      }
    } catch (error) {
      console.error("❌ Ошибка сохранения позиции:", error);
      setApiError("Ошибка сохранения. Проверьте консоль.");
    }
  };
  