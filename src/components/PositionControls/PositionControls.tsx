"use client";

interface PositionControlsProps {
  positionNameEn: string;
  positionNameRu: string;
  setPositionNameEn: (name: string) => void;
  setPositionNameRu: (name: string) => void;
  onSave: () => void;
  buttonVariant: "neutral" | "decline" | "agree";
  buttonText: string;
}

const PositionControls: React.FC<PositionControlsProps> = ({
  positionNameEn,
  positionNameRu,
  setPositionNameEn,
  setPositionNameRu,
  onSave,
  buttonVariant,
  buttonText,
}) => {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <input
        type="text"
        className="border p-2 rounded"
        value={positionNameEn}
        onChange={(e) => setPositionNameEn(e.target.value)}
        placeholder="Название позиции (English)"
      />
      <input
        type="text"
        className="border p-2 rounded"
        value={positionNameRu}
        onChange={(e) => setPositionNameRu(e.target.value)}
        placeholder="Название позиции (Русский)"
      />
      <button className={`p-2 rounded text-white ${buttonVariant}`} onClick={onSave}>
        {buttonText}
      </button>
    </div>
  );
};

export default PositionControls;
