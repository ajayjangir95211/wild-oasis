import { differenceInDays, eachDayOfInterval, format, subDays } from "date-fns";
import { ErrorAlert, PrimaryBtn, Spinner } from "../components/UI";
import { useGetBookings } from "../features/booking/hooks";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useThemeContext } from "../contexts/ThemeContext";
import { priceFormatter } from "../utils/priceFormatter";
import { useState } from "react";
import { HiOutlineBriefcase, HiOutlineCash } from "react-icons/hi";
import { HiOutlineBuildingOffice, HiOutlineCheckBadge } from "react-icons/hi2";
import { useGetCabins } from "../features/cabin/hooks";

const DEFAULT_DATE_RANGE = {
  start: new Date(2024, 10, 1),
  end: new Date(2024, 11, 31),
};
export function HomePage() {
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const { theme } = useThemeContext();

  const { isPendingBookings, data: bookings, errorBookings } = useGetBookings();
  const { isPendingCabins, data: cabins, errorCabins } = useGetCabins();

  let totalBookings = 0;
  let totalSales = 0;
  const recordsMap = {};

  const stays = [
    {
      name: "1 Day",
      count: 0,
      color: "#ef4444",
    },
    {
      name: "2 Days",
      count: 0,
      color: "#f59e0b",
    },
    {
      name: "3 Days",
      count: 0,
      color: "#84cc16",
    },
    {
      name: "4 Days",
      count: 0,
      color: "#10b981",
    },
    {
      name: "5 Days",
      count: 0,
      color: "#06b6d4",
    },
    {
      name: "6 Days",
      count: 0,
      color: "#3b82f6",
    },
    {
      name: "1 Week",
      count: 0,
      color: "#8b5cf6",
    },
    {
      name: "Others",
      count: 0,
      color: "#d946ef",
    },
  ];

  bookings?.forEach((booking) => {
    const date = new Date(booking.created_at).toDateString();

    if (new Date(booking.created_at) >= dateRange.start) {
      const duration = differenceInDays(booking.end_date, booking.start_date);
      stays[duration > 7 ? 7 : duration].count++;
    }
    if (!recordsMap[date]) recordsMap[date] = { sales: 0, bookings: 0 }; // Initialize the date entry

    recordsMap[date].sales += booking.price;
    recordsMap[date].bookings += 1;
  });

  const dates = eachDayOfInterval(dateRange);

  const recordsByDate = dates.map((date) => {
    const salesOnDate = recordsMap[date.toDateString()]?.sales || 0;
    const bookingsOnDate = recordsMap[date.toDateString()]?.bookings || 0;

    totalSales += salesOnDate;
    totalBookings += bookingsOnDate;

    return {
      date: format(date, "MMM dd"),
      sales: salesOnDate,
      bookings: bookingsOnDate,
    };
  });

  if (isPendingBookings || isPendingCabins) return <Spinner />;
  if (errorBookings || errorCabins) return <ErrorAlert />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold md:text-4xl">DashBoard</h3>
        <div className="flex items-center gap-2 justify-self-end">
          <PrimaryBtn
            onClick={() =>
              setDateRange({ start: subDays(new Date(), 7), end: new Date() })
            }
            className="text-nowrap"
          >
            Last Week
          </PrimaryBtn>
          <PrimaryBtn onClick={() => setDateRange(DEFAULT_DATE_RANGE)}>
            Deafult
          </PrimaryBtn>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-between gap-4">
          <div className="flex items-center gap-4 rounded-xl bg-gray-200 p-4 dark:bg-gray-800">
            <HiOutlineBriefcase className="size-12 rounded-full bg-blue-500 p-2" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Bookings</span>
              <span className="text-2xl">{totalBookings}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-gray-200 p-4 dark:bg-gray-800">
            <HiOutlineCash className="size-12 rounded-full bg-yellow-500 p-2" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Sales</span>
              <span className="text-2xl">{priceFormatter(totalSales)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-gray-200 p-4 dark:bg-gray-800">
            <HiOutlineBuildingOffice className="size-12 rounded-full bg-green-500 p-2" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Cabins</span>
              <span className="text-2xl">{cabins?.length || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex max-h-[300px] min-h-[250px] w-full flex-col gap-2 overflow-auto rounded-xl bg-gray-200 p-4 dark:bg-gray-800">
          <h2 className="text-lg font-semibold">Stay Duration Summary</h2>
          <ResponsiveContainer className="aspect-video size-full overflow-auto">
            <PieChart className="dark:text-light" data={stays}>
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconType="circle"
                iconSize={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#111827" : "#f3f4f6",
                  color: theme === "light" ? "#111827" : "#f3f4f6",
                  border: "1px solid #6b7280",
                  borderRadius: "8px",
                }}
                itemStyle={{
                  color: theme === "dark" ? "#f3f4f6" : "#111827", // Tooltip items
                }}
                formatter={(value, name) => [
                  name === "sales" ? priceFormatter(value) : value,
                  name,
                ]}
              />
              <Pie data={stays} dataKey="count">
                {stays.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-xl bg-gray-200 p-4 dark:bg-gray-800">
        <h2 className="text-lg font-semibold">
          Sales from {format(dateRange.start, "yyyy MMM dd")} to{" "}
          {format(dateRange.end, "yyyy MMM dd")}
        </h2>
        <ResponsiveContainer className="aspect-video size-full">
          <AreaChart data={recordsByDate}>
            <defs>
              <linearGradient
                id="lightGradientSales"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="25%" stopColor="#22c55e" stopOpacity={1} />
                <stop offset="100%" stopColor="#f3f4f6" stopOpacity={1} />
              </linearGradient>

              <linearGradient
                id="darkGradientSales"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="25%" stopColor="#22c55e" stopOpacity={1} />
                <stop offset="100%" stopColor="#111827" stopOpacity={1} />
              </linearGradient>

              <linearGradient
                id="lightGradientBookings"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="25%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#f3f4f6" stopOpacity={1} />
              </linearGradient>

              <linearGradient
                id="darkGradientBookings"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="25%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#111827" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Legend
              wrapperStyle={{ paddingBottom: ".5rem" }}
              verticalAlign="top"
            />
            <CartesianGrid strokeDasharray="5 5" stroke="#6b7280" />
            <XAxis
              dataKey="date"
              stroke={theme === "light" ? "#111827" : "#f3f4f6"}
              axisLine={false}
            />
            <YAxis
              yAxisId="sales"
              stroke={theme === "light" ? "#111827" : "#f3f4f6"}
              axisLine={false}
              tickFormatter={priceFormatter}
            />
            <YAxis
              yAxisId="bookings"
              stroke={theme === "light" ? "#111827" : "#f3f4f6"}
              axisLine={false}
              orientation="right"
              allowDecimals={false}
              tickCount={11}
              domain={[0, 20]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#111827" : "#f3f4f6",
                color: theme === "light" ? "#111827" : "#f3f4f6",
                border: "1px solid #6b7280",
                borderRadius: "8px",
              }}
              formatter={(value, name) => [
                name === "sales" ? priceFormatter(value) : value,
                name,
              ]}
            />

            <Area
              dataKey="sales"
              type="monotone"
              stroke="#22c55e"
              fill={
                theme === "light"
                  ? "url(#lightGradientSales)"
                  : "url(#darkGradientSales)"
              }
              yAxisId="sales"
              name="Sales"
            />
            <Area
              dataKey="bookings"
              type="monotone"
              stroke="#3b82f6"
              fill={
                theme === "light"
                  ? "url(#lightGradientBookings)"
                  : "url(#darkGradientBookings)"
              }
              yAxisId="bookings"
              name="Bookings"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
