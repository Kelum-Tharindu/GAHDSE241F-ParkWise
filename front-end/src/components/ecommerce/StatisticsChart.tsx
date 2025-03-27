import React, { Suspense } from 'react';
import { ApexOptions } from 'apexcharts';
import ChartTab from '../common/ChartTab';

// Dynamic import using React.lazy for code splitting
const Chart = React.lazy(() => import('react-apexcharts'));

interface StatisticsChartProps {
  className?: string;
}

export default function StatisticsChart({ className = '' }: StatisticsChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 310,
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        speed: 800
      }
    },
    colors: ['#465FFF', '#9CB9FF'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: 'round'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    markers: {
      size: 5,
      strokeWidth: 0,
      hover: { size: 7 }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      markers: { size: 5 },
      itemMargin: { horizontal: 12 }
    },
    grid: {
      borderColor: '#F1F1F1',
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 20, bottom: 0, left: 20 }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { 
        style: { 
          colors: '#6B7280',
          fontSize: '12px'
        } 
      },
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: {
        style: { 
          colors: '#6B7280', 
          fontSize: '12px' 
        },
        formatter: (value: number) => `$${value}K`
      }
    },
    tooltip: {
      y: { 
        formatter: (value: number) => `$${value}K` 
      },
      marker: { show: false }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: { height: 250 },
        legend: { position: 'bottom' }
      }
    }]
  };

  const series = [
    {
      name: 'Sales',
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235]
    },
    {
      name: 'Revenue',
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140]
    }
  ];

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Target you've set for each month
          </p>
        </div>
        <div className="flex justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px] xl:min-w-full">
          <Suspense fallback={<div className="flex h-[310px] items-center justify-center">Loading chart...</div>}>
            <Chart 
              options={options} 
              series={series} 
              type="area" 
              height={310}
              width="100%"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}