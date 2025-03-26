"use client"

import { use, useState } from "react"
import { ArrowLeft, ArrowUp, ArrowDown, DollarSign, BarChart3, Clock, Info } from "lucide-react"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

import { useCryptoById } from "@/hooks/useCryptoById";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

// Type definition for cryptocurrency data
interface CryptoData {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  sparkline_in_7d: {
    price: number[]
  }
}

export default function CryptoDetailPage({ params }: { params: { id: string } }) {
	const { id } = use(params);
	const { data, isLoading, isError } = useCryptoById(id as string);
	const [timeframe, setTimeframe] = useState("7d");

	console.log("my data: ", data, id);
	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Format large numbers
	const formatNumber = (num: number) => {
		if (num >= 1000000000000) {
			return `$${(num / 1000000000000).toFixed(2)}T`;
		} else if (num >= 1000000000) {
			return `$${(num / 1000000000).toFixed(2)}B`;
		} else if (num >= 1000000) {
			return `$${(num / 1000000).toFixed(2)}M`;
		} else {
			return `$${num.toLocaleString()}`;
		}
	};

	// Format percentage safely
	const formatPercentage = (percentage: number | null | undefined) => {
		if (typeof percentage === "number" && !isNaN(percentage)) {
			return `${percentage.toFixed(2)}%`;
		}
		return "N/A"; // Fallback for invalid or missing values
	};

	// Generate chart labels based on timeframe
	const generateChartLabels = (timeframe: string) => {
		const labels = [];
		const now = new Date();

		if (timeframe === "24h") {
			for (let i = 24; i >= 0; i--) {
				const date = new Date(now);
				date.setHours(now.getHours() - i);
				labels.push(date.toLocaleTimeString("en-US", { hour: "numeric" }));
			}
		} else if (timeframe === "7d") {
			for (let i = 7; i >= 0; i--) {
				const date = new Date(now);
				date.setDate(now.getDate() - i);
				labels.push(
					date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
				);
			}
		} else if (timeframe === "30d") {
			for (let i = 30; i >= 0; i -= 3) {
				const date = new Date(now);
				date.setDate(now.getDate() - i);
				labels.push(
					date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
				);
			}
		} else if (timeframe === "1y") {
			for (let i = 12; i >= 0; i--) {
				const date = new Date(now);
				date.setMonth(now.getMonth() - i);
				labels.push(date.toLocaleDateString("en-US", { month: "short" }));
			}
		}

		return labels;
	};

	if (isLoading) {
		return <LoadingState />;
	}

	if (!data) {
		return (
			<div className='container flex min-h-screen items-center justify-center px-4 py-6'>
				<div className='text-center'>
					<h1 className='mb-4 text-2xl font-bold'>Cryptocurrency not found</h1>
					<Link href='/'>
						<Button>
							<ArrowLeft className='mr-2 h-4 w-4' />
							Back to Dashboard
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			<header className='sticky top-0 z-10 border-b bg-background'>
				<div className='container flex h-16 items-center px-4'>
					<Link href='/'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-5 w-5' />
							<span className='sr-only'>Back</span>
						</Button>
					</Link>
					<div className='ml-4 flex items-center gap-3'>
						<img
							src={data?.image?.small || "/placeholder.svg"}
							alt={data?.name}
							className='h-8 w-8'
						/>
						<div>
							<h1 className='text-xl font-bold'>
								{data?.id?.charAt(0).toUpperCase() + data?.id?.slice(1)}
							</h1>
							<div className='flex items-center gap-2'>
								<span className='text-sm uppercase text-muted-foreground'>
									{data?.symbol}
								</span>
								<span className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium'>
									Rank #{data?.market_data?.market_cap_rank}
								</span>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className='container px-4 py-6'>
				<div className='grid gap-6 md:grid-cols-3'>
					{/* Price Overview Card */}
					<Card className='md:col-span-2'>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<div>
								<CardTitle className='text-2xl'>
									${data?.market_data?.current_price?.usd?.toLocaleString()}
								</CardTitle>
								<CardDescription className='flex items-center'>
									<span
										className={`flex items-center ${
											data?.market_data?.price_change_percentage_24h >= 0
												? "text-green-500"
												: "text-red-500"
										}`}
									>
										{data?.market_data?.price_change_percentage_24h >= 0 ? (
											<ArrowUp className='mr-1 h-3 w-3' />
										) : (
											<ArrowDown className='mr-1 h-3 w-3' />
										)}
										{formatPercentage(
											Math.abs(data?.market_data?.price_change_percentage_24h)
										)}{" "}
										(24h)
									</span>
									<span className='ml-2 text-muted-foreground'>
										Last updated: {formatDate(data?.last_updated)}
									</span>
								</CardDescription>
							</div>
							<Tabs
								defaultValue='7d'
								className='w-[300px]'
								onValueChange={setTimeframe}
							>
								<TabsList className='grid w-full grid-cols-4'>
									<TabsTrigger value='24h'>24h</TabsTrigger>
									<TabsTrigger value='7d'>7d</TabsTrigger>
									<TabsTrigger value='30d'>30d</TabsTrigger>
									<TabsTrigger value='1y'>1y</TabsTrigger>
								</TabsList>
							</Tabs>
						</CardHeader>
						<CardContent>
							<div className='h-[300px] w-full'>
								<Line
									data={{
										labels: generateChartLabels(timeframe),
										datasets: [
											{
												label: data?.name,
												data: data?.market_data?.sparkline_7d?.price,
												borderColor:
													data?.market_data?.price_change_percentage_24h >= 0
														? "#10b981"
														: "#ef4444",
												backgroundColor:
													data?.market_data?.price_change_percentage_24h >= 0
														? "rgba(16, 185, 129, 0.1)"
														: "rgba(239, 68, 68, 0.1)",
												borderWidth: 2,
												tension: 0.4,
												fill: true,
												pointRadius: 0,
												pointHoverRadius: 4,
											},
										],
									}}
									options={{
										responsive: true,
										maintainAspectRatio: false,
										plugins: {
											legend: {
												display: false,
											},
											tooltip: {
												mode: "index",
												intersect: false,
												callbacks: {
													label: (context) =>
														`${context.dataset.label}: $${context.parsed.y.toLocaleString()}`,
												},
											},
										},
										scales: {
											x: {
												grid: {
													display: false,
												},
											},
											y: {
												position: "right",
												grid: {
													borderDash: [5, 5],
												},
												ticks: {
													callback: (value) => "$" + value.toLocaleString(),
												},
											},
										},
										interaction: {
											mode: "nearest",
											axis: "x",
											intersect: false,
										},
									}}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Market Stats Card */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<BarChart3 className='h-5 w-5' />
								Market Stats
							</CardTitle>
						</CardHeader>
						<CardContent className='grid gap-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-muted-foreground'>Market Cap</p>
									<p className='font-medium'>
										{formatNumber(data?.market_data?.market_cap)}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>24h Volume</p>
									<p className='font-medium'>
										{formatNumber(data?.market_data?.total_volume)}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>24h High</p>
									<p className='font-medium'>
										${data?.market_data?.high_24h.toLocaleString()}
									</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>24h Low</p>
									<p className='font-medium'>
										${data?.market_data?.low_24h.toLocaleString()}
									</p>
								</div>
							</div>

							<div>
								<div className='mb-1 flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Circulating Supply
									</p>
									<p className='text-sm font-medium'>
										{data?.market_data?.market_data?.circulating_supply.toLocaleString()}{" "}
										{data?.symbol.toUpperCase()}
									</p>
								</div>
								<Progress
									value={
										(data?.market_data?.circulating_supply /
											data?.market_data?.max_supply) *
										100
									}
									className='h-2'
								/>
								<div className='mt-1 flex justify-between text-xs text-muted-foreground'>
									<span>
										{(
											(data?.market_data?.circulating_supply /
												data?.market_data?.max_supply) *
											100
										).toFixed(1)}
										%
									</span>
									<span>
										Max: {data?.market_data?.max_supply.toLocaleString()}
									</span>
								</div>
							</div>

							<div className='grid gap-2'>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>All Time High</p>
									<div className='text-right'>
										<p className='font-medium'>
											${data?.market_data?.ath.toLocaleString()}
										</p>
										<p className='text-xs text-muted-foreground'>
											{formatDate(data?.market_data?.ath_date)}
										</p>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>All Time Low</p>
									<div className='text-right'>
										<p className='font-medium'>
											${data?.market_data?.atl.toLocaleString()}
										</p>
										<p className='text-xs text-muted-foreground'>
											{formatDate(data?.market_data?.atl_date)}
										</p>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>From ATH</p>
									<p
										className={`text-sm font-medium ${data?.market_data?.ath_change_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
									>
										{formatPercentage(data?.market_data?.ath_change_percentage)}
									</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>From ATL</p>
									<p
										className={`text-sm font-medium ${data?.market_data?.atl_change_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
									>
										{formatPercentage(data?.market_data?.atl_change_percentage)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Additional Information Cards */}
				<div className='mt-6 grid gap-6 md:grid-cols-3'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<DollarSign className='h-5 w-5' />
								Price Statistics
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Price Change (24h)
									</p>
									<p
										className={`font-medium ${data?.market_data?.price_change_24h >= 0 ? "text-green-500" : "text-red-500"}`}
									>
										$
										{Math.abs(
											data?.market_data?.price_change_24h
										).toLocaleString()}
									</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Price Change % (24h)
									</p>
									<p
										className={`font-medium ${data?.market_data?.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
									>
										{formatPercentage(
											data?.market_data?.price_change_percentage_24h
										)}
									</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Market Cap Change (24h)
									</p>
									<p
										className={`font-medium ${data?.market_data?.market_cap_change_24h >= 0 ? "text-green-500" : "text-red-500"}`}
									>
										{formatNumber(
											Math.abs(data?.market_data?.market_cap_change_24h)
										)}
									</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Market Cap Change % (24h)
									</p>
									<p
										className={`font-medium ${data?.market_data?.market_cap_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
									>
										{formatPercentage(
											data?.market_data?.market_cap_change_percentage_24h
										)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Info className='h-5 w-5' />
								Supply Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Circulating Supply
									</p>
									<p className='font-medium'>
										{data?.market_data?.circulating_supply.toLocaleString()}{" "}
										{data?.symbol.toUpperCase()}
									</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>Total Supply</p>
									<p className='font-medium'>
										{data?.market_data?.total_supply.toLocaleString()}{" "}
										{data?.symbol.toUpperCase()}
									</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>Max Supply</p>
									<p className='font-medium'>
										{data?.market_data?.max_supply.toLocaleString()}{" "}
										{data?.symbol.toUpperCase()}
									</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Fully Diluted Valuation
									</p>
									<p className='font-medium'>
										{formatNumber(data?.market_data?.fully_diluted_valuation)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Clock className='h-5 w-5' />
								Historical Data
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>All Time High</p>
									<div className='text-right'>
										<p className='font-medium'>
											${data?.market_data?.ath.toLocaleString()}
										</p>
										<p className='text-xs text-muted-foreground'>
											{formatDate(data?.market_data?.ath_date)}
										</p>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>All Time Low</p>
									<div className='text-right'>
										<p className='font-medium'>
											${data?.market_data?.atl.toLocaleString()}
										</p>
										<p className='text-xs text-muted-foreground'>
											{formatDate(data?.market_data?.atl_date)}
										</p>
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Price Change Since ATH
									</p>
									<p
										className={`font-medium ${data?.market_data?.ath_change_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
									>
										{formatPercentage(data?.market_data?.ath_change_percentage)}
									</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>
										Price Change Since ATL
									</p>
									<p
										className={`font-medium ${data?.market_data?.atl_change_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
									>
										{formatPercentage(data?.market_data?.atl_change_percentage)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}

// Helper function to generate mock price data
function generateMockPriceData(currentPrice: number, dataPoints: number) {
  const prices = []
  let price = currentPrice

  for (let i = 0; i < dataPoints; i++) {
    // Generate random price fluctuation between -2% and +2%
    const change = price * (Math.random() * 0.04 - 0.02)
    price += change
    prices.push(price)
  }

  return prices
}

// Loading state component
function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="ml-4 flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-1 h-4 w-20" />
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="mt-1 h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-[300px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-1 h-5 w-16" />
                  </div>
                ))}
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>

              <div className="grid gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

