import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../uiMy/dropdown/Dropdown";
import { DropdownItem } from "../uiMy/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useEffect, useState } from "react";
import { MonthlyBookingsData, fallbackMonthlyBookings, getMonthlyBookings } from "../../services/bookingAnalyticsService";

export default function MonthlySalesChart() {
  const [bookingData, setBookingData] = useState<MonthlyBookingsData>(fallbackMonthlyBookings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const data = await getMonthlyBookings();
        setBookingData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError("Failed to load booking analysis data");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);  // Calculate total bookings for the year
  const totalBookings = bookingData.data.reduce((sum, count) => sum + count, 0);
  
  // Find highest month for highlighting
  const highestBookingCount = Math.max(...bookingData.data);
  const highestBookingMonth = bookingData.data.indexOf(highestBookingCount);
  
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: bookingData.months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        formatter: (val) => Math.round(val).toString()
      }
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,      colors: [(context: { dataPointIndex: number }) => {
        // Highlight the month with the highest bookings
        if (context.dataPointIndex === highestBookingMonth) {
          return '#22c55e'; // Green color for highest month
        }
        return '#465fff'; // Default blue color
      }]
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => `${val} bookings`,
      },
      marker: {
        show: true,
      },      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const value = series[seriesIndex][dataPointIndex];
        const month = bookingData.months[dataPointIndex];
        const percentage = ((value / totalBookings) * 100).toFixed(1);
        
        return `
          <div class="custom-tooltip p-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
            <div class="font-medium text-gray-800 dark:text-white">${month} ${bookingData.year}</div>
            <div class="flex items-center mt-1">
              <span class="w-3 h-3 rounded-full mr-1 bg-primary"></span>
              <span class="text-gray-600 dark:text-gray-300">${value} bookings (${percentage}%)</span>
            </div>
          </div>
        `;
      }
    },
  };const series = [
    {
      name: "Bookings",
      data: bookingData.data,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Booking Analysis
          </h3>
          {!loading && !error && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {bookingData.year} Monthly Booking Statistics
            </p>
          )}
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>      <div className="max-w-full overflow-x-auto custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-[180px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[180px] text-red-500">
            <p>{error}</p>
            <button 
              className="ml-2 text-primary hover:underline"
              onClick={() => {
                setLoading(true);
                setError(null);
                getMonthlyBookings()
                  .then(data => {
                    setBookingData(data);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.error("Error retrying booking data fetch:", err);
                    setError("Failed to load booking analysis data");
                    setLoading(false);
                  });
              }}
            >
              Retry
            </button>
          </div>        ) : (
          <>
            <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
              <Chart options={options} series={series} type="bar" height={180} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{totalBookings}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Highest Month</p>
                <p className="text-xl font-semibold text-green-600 dark:text-green-500">
                  {bookingData.months[highestBookingMonth]} ({highestBookingCount})
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
