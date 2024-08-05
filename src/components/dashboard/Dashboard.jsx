import React, { useState, useEffect } from "react";
import totalOrderQuantity from "../../assets/total-order-quantity.png";
import totalProduct from "../../assets/total-product.png";
import apiService from "../../apiService";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalStocksCount, setTotalStocksCount] = useState(null);

  useEffect(() => {
    // Fetch total products count from API
    const fetchTotalProducts = async () => {
      try {
        const response = await apiService.get("/products/getall", {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data); // Log response data to verify
        setTotalProducts(response.data.length);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    };

    // Fetch total order quantity from API

    const fetchTotalOrders = async () => {
      try {
        const response = await apiService.get("/purchases/all", {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data); // Log response data to verify
        setTotalOrders(response.data.length);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    const fetchTotalStocks = async () => {
        try {
          const response = await apiService.get("/stocks/stockIn/all", {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(response.data);
          setTotalStocksCount(response.data.length);
        } catch (error){
          console.error("Error fetching total stocks:", error);
        }
    }

    fetchTotalProducts();
    fetchTotalOrders();
    fetchTotalStocks();
  }, [totalProducts]);

  return (
    <div className="grid grid-rows-4 h-screen mt-2">
      <div className="grid-rows-1">
        <div className="col-span-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow-lg p-6 rounded-lg flex items-center pt-8 pb-12 border-b-8 border-blue-500">
              <img
                src={totalProduct}
                alt="Total Product"
                className="h-16 w-16 mr-4"
              />
              <div className="ml-3">
                <h2 className="text-lg">Total Product</h2>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg flex items-center pt-8 pb-12 border-b-8 border-green-500">
              <img
                src={totalOrderQuantity}
                alt="Total Order"
                className="h-16 w-16 mr-4"
              />
              <div className="ml-3">
                <h2 className="text-lg">Total Order Quantity</h2>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg flex items-center pt-8 pb-12 border-b-8 border-yellow-500">
              <img
                src={totalProduct}
                alt="Total Stocks"
                className="h-16 w-16 mr-4"
              />
              <div className="ml-3">
                <h2 className="text-lg">Total Stocks</h2>
                <p className="text-2xl font-bold">{totalStocksCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-rows-3"></div>
    </div>
  );
};

export default Dashboard;
