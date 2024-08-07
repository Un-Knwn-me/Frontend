import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement } from "chart.js";
import totalOrderQuantity from "../../assets/total-order-quantity.png";
import totalProduct from "../../assets/total-product.png";
import apiService from "../../apiService";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement);

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalStocksCount, setTotalStocksCount] = useState(null);
  const [purchaseChartData, setPurchaseChartData] = useState({ labels: [], datasets: [] });
  const [stockoutChartData, setStockoutChartData] = useState({ labels: [], datasets: [] });
  const [categoryChartData, setCategoryChartData] = useState({ labels: [], datasets: [] });

  const [purchaseTimeFrame, setPurchaseTimeFrame] = useState('7days');
  const [stockoutTimeFrame, setStockoutTimeFrame] = useState('7days');

  const getDateNDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date;
  };

  const filterDataByDate = (data, timeFrame) => {
    const now = new Date();
    let startDate;

    if (timeFrame === '7days') {
      startDate = getDateNDaysAgo(7);
    } else if (timeFrame === 'weekly') {
      startDate = getDateNDaysAgo(30);
    } else if (timeFrame === 'monthly') {
      startDate = getDateNDaysAgo(90);
    }

    return data.filter(item => new Date(item.created_at.split('/').reverse().join('-')) >= startDate);
  };

  useEffect(() => {
    // Fetch total products count from API
    const fetchTotalProducts = async () => {
      try {
        const response = await apiService.get("/products/getall", {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setTotalProducts(response.data.length);
      } catch (error) {
        console.error("Error fetching total products:", error);
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
    
        // Filter data to include only items with total_pcs greater than 0
        const filteredData = response.data.filter(item => item.total_pcs > 0);
    
        // Group data by category
        const categoryData = filteredData.reduce((acc, item) => {
          const category = item.Product.Category.categoryName;
          if (!acc[category]) acc[category] = 0;
          acc[category] += item.total_pcs;
          return acc;
        }, {});
    
        const labels = Object.keys(categoryData);
        const values = Object.values(categoryData);
    
        setCategoryChartData({
          labels,
          datasets: [
            {
              label: "Stock by Category",
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
        setTotalStocksCount(filteredData.length);
      } catch (error) {
        console.error("Error fetching total stocks:", error);
      }
    };
    

    // Fetch purchase data by date
    const fetchPurchaseData = async () => {
      try {
        const response = await apiService.get("/purchases/all", {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setTotalOrders(response.data.length);

        const filteredData = filterDataByDate(response.data, purchaseTimeFrame);
        const data = filteredData.map(item => ({
          ...item,
          created_at: new Date(item.created_at.split('/').reverse().join('-')).toLocaleDateString('en-GB')
        }));

        const labels = Array.from(new Set(data.map(item => item.created_at)));
        const values = labels.map(label => {
          return data
            .filter(item => item.created_at === label)
            .reduce((sum, item) => sum + item.req_purchase_qty, 0);
        });

        setPurchaseChartData({
          labels,
          datasets: [
            {
              label: "Purchases by Date",
              data: values,
              fill: false,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching purchase data by date:", error);
      }
    };

    // Fetch stockout data by date
    const fetchStockoutData = async () => {
      try {
        const response = await apiService.get("/stockOut/get/all", {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const filteredData = filterDataByDate(response.data, stockoutTimeFrame);
        const data = filteredData.map(item => ({
          ...item,
          created_at: new Date(item.created_at.split('/').reverse().join('-')).toLocaleDateString('en-GB')
        }));

        const labels = Array.from(new Set(data.map(item => item.created_at)));
        const values = filteredData.map(item => item.total_stockOut_pcs);

        setStockoutChartData({
          labels,
          datasets: [
            {
              label: "Stockouts by Date",
              data: values,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching stockout data by date:", error);
      }
    };

    fetchTotalProducts();
    fetchTotalStocks();
    fetchPurchaseData();
    fetchStockoutData();
  }, [purchaseTimeFrame, stockoutTimeFrame]);

  return (
    <div className="grid gap-4 -mt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 -mb-4">
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center border-b-4 border-blue-500">
          <img
            src={totalProduct}
            alt="Total Product"
            className="h-12 w-12 mr-4"
          />
          <div className="ml-3">
            <h2 className="text-lg">Total Product</h2>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center border-b-4 border-green-500">
          <img
            src={totalOrderQuantity}
            alt="Total Order"
            className="h-12 w-12 mr-4"
          />
          <div className="ml-3">
            <h2 className="text-lg">Total Order Quantity</h2>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center border-b-4 border-yellow-500">
          <img
            src={totalProduct}
            alt="Total Stocks"
            className="h-12 w-12 mr-4"
          />
          <div className="ml-3">
            <h2 className="text-lg">Total Stocks</h2>
            <p className="text-2xl font-bold">{totalStocksCount}</p>
          </div>
        </div>
      </div>
      <div className="p-4 grid gap-4">
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Stockouts by Date</h2>
            <select
              value={stockoutTimeFrame}
              onChange={(e) => setStockoutTimeFrame(e.target.value)}
              className="border rounded p-2"
            >
              <option value="7days">Last 7 Days</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="grid grid-cols-5">
          <div className="h-64 col-span-3">
            <Bar data={stockoutChartData}/>
          </div>
          <div className="col-span-2 px-10">
            <h2 className="text-xl font-semibold mb-4">Value:</h2>
            <ul>
              {stockoutChartData.labels.map((label, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{label}</span>
                  <span className="font-bold">{stockoutChartData.datasets[0].data[index]}</span>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white shadow-lg col-span-3 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Purchases by Date</h2>
              <select
                value={purchaseTimeFrame}
                onChange={(e) => setPurchaseTimeFrame(e.target.value)}
                className="border rounded p-2"
              >
                <option value="7days">Last 7 Days</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="h-64">
              <Line data={purchaseChartData} />
            </div>
          </div>
          <div className="bg-white shadow-lg col-span-2 p-4 rounded-lg flex">
            <div className="w-1/2 h-64 flex flex-col justify-center mt-5">
            <h2 className="text-xl font-semibold mb-4">Stocks by Category</h2>
              <Doughnut data={categoryChartData} />
            </div>
            <div className="w-1/2 flex flex-col justify-center px-4">
              <h2 className="text-xl font-semibold mb-4">Value:</h2>
              <ul>
                {categoryChartData.labels.map((label, index) => (
                  <li key={index} className="flex justify-between items-center mb-2">
                    <span>{label}</span>
                    <span className="font-bold">{categoryChartData.datasets[0].data[index]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;