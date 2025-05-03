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

      console.log("Fetched stores:", data); // 🐛 Debug log

      const enrichedData = await Promise.all(
        data.map(async (store: any) => {
          let userRating = null;
          let stats = { averageRating: "N/A" };

          try {
            const [userRatingRes, statsRes] = await Promise.all([
              get(`/rating?storeId=${store.store_id}`, {
                Authorization: `Bearer ${token}`,
              }),
              get(`/rating/stats/${store.store_id}`, {
                Authorization: `Bearer ${token}`,
              }),
            ]);
            userRating = userRatingRes?.[0]?.rating || null;
            stats = statsRes || { averageRating: "N/A" };
          } catch (ratingErr) {
            console.warn(
              `Rating fetch failed for store ${store.store_id}:`,
              ratingErr
            );
          }

          // Log individual store after enrichment
          console.log("Enriched store:", {
            ...store,
            userRating,
            overallRating: stats.averageRating,
          });

          return {
            ...store,
            userRating,
            overallRating: stats.averageRating,
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
          store.name?.toLowerCase().includes(value) ||
          store.address?.toLowerCase().includes(value)
      )
    );
  };

  const handleRateClick = (store: any) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating: number, comment: string) => {
    try {
      // Submit the rating to the backend
      await post(
        "/rating",
        {
          rating,
          comment,
          storeId: selectedStore.store_id,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      // Update the userRating and userComment in the store state directly
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.store_id === selectedStore.store_id
            ? {
                ...store,
                userRating: rating, // Update the user rating
                userComment: comment, // Update the comment as well
              }
            : store
        )
      );

      // Close the modal and reset selected store
      setShowRatingModal(false);
      setSelectedStore(null);
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
          <div key={store.store_id || Math.random()}>
            {store.name && store.address ? (
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
            ) : (
              <p className="text-red-500">Invalid store data</p>
            )}
          </div>
        ))}
      </div>

      <RatingModal
        storeName={selectedStore?.name || ""}
        initialRating={selectedStore?.userRating || null}
        initialComment={selectedStore?.userComment || ""}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
      />
    </>
  );
};

export default UserDashboard;
