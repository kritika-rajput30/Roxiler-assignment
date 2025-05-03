import React from "react";

type StoreCardProps = {
  store: {
    store_id: string;
    name: string;
    address: string;
    overallRating: number;
    image: string;
    userRating: number | null;
  };
  onRateClick: (store: any) => void;
};

const StoreCard: React.FC<StoreCardProps> = ({ store, onRateClick }) => {
  return (
    <div className="bg-white shadow-md rounded-lg">
      <img
        src={store.image}
        alt={store.name}
        className="w-full h-60 object-cover rounded mb-4"
      />
      <div className="flex flex-col p-4">
        <h3 className="text-xl font-semibold">{store.name}</h3>
        <p className="text-gray-600">{store.address}</p>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="font-medium">⭐ Avg. Rating: {store.overallRating}</p>
            <p className="font-medium">
              🧑‍💻 Your Rating: {store.userRating || "Not Rated"}
            </p>
          </div>
          <button
            onClick={() => onRateClick(store)}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            {store.userRating ? "Modify Rating" : "Add Rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
