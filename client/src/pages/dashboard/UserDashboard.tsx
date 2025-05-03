import React, { useState, useEffect } from "react";
import { get, post } from "../../utils/api";
import StoreCard from "../../components/StoreCard";
import { useSelector } from "react-redux";
import RatingModal from "../../components/RatingForm";

const UserDashboard = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [filteredStores, setFilteredStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const token = useSelector((state: any) => state.auth.token);

  const fetchStores = async () => {
    try {
      const data = await get("/store", {
        Authorization: `Bearer ${token}`,
      });

      const enrichedData = await Promise.all(
        data.map(async (store: any) => {
          const [userRating, stats] = await Promise.all([
            get(`/rating?storeId=${store.store_id}`, {
              Authorization: `Bearer ${token}`,
            }),
            get(`/rating/stats/${store.store_id}`, {
              Authorization: `Bearer ${token}`,
            }),
          ]);

          return {
            ...store,
            userRating: userRating?.[0]?.rating || null,
            overallRating: stats?.averageRating || "N/A",
          };
        })
      );

      setStores(enrichedData);
      setFilteredStores(enrichedData);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    setFilteredStores(
      stores.filter(
        (store) =>
          store.name.toLowerCase().includes(value) ||
          store.address.toLowerCase().includes(value)
      )
    );
  };

  const handleRateClick = (store: any) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating: number) => {
    try {
      // Get the token from the Redux store or wherever it's stored
      const token = useSelector((state: any) => state.auth.token);
  
      // Submit rating with Authorization header
      await post("/rating", {
        rating,
        storeId: selectedStore.store_id,
      }, {
        Authorization: `Bearer ${token}`,
      });
  
      setShowRatingModal(false);
      setSelectedStore(null);
      fetchStores(); // Refresh the store list after rating
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };
  

  return (
    <>
      <div className="my-4">
        <input
          type="text"
          placeholder="Search by store name or address"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <div key={store.store_id}>
            <StoreCard
              store={{
                store_id: store.store_id,
                name: store.name,
                address: store.address,
                image: store.image,
                overallRating: store.overallRating,
                userRating: store.userRating,
              }}
              onRateClick={handleRateClick}
            />
          </div>
        ))}
      </div>

      <RatingModal
        storeName={selectedStore?.name || ""}
        initialRating={selectedStore?.userRating || null}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
      />
    </>
  );
};

export default UserDashboard;
