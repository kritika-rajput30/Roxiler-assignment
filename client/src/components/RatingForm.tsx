import React, { useState, useEffect } from "react";

type RatingModalProps = {
  storeName: string;
  initialRating: number | null;
  initialComment: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void; // Passing both rating and comment
};

const RatingModal: React.FC<RatingModalProps> = ({
  storeName,
  initialRating,
  initialComment,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [comment, setComment] = useState(initialComment || "");

  useEffect(() => {
    setRating(initialRating || 0);
    setComment(initialComment || "");
  }, [initialRating, initialComment]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Rate {storeName}</h2>
        <label className="block mb-2 text-sm text-gray-600">Rating (1 to 5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4"
        />
        <label className="block mb-2 text-sm text-gray-600">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Add your comment"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onSubmit(rating, comment)} // Passing both rating and comment
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
