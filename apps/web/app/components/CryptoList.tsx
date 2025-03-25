"use client";

import { useState } from "react";

import {
	ArrowDown,
	ArrowUp,
	Bell,
	ChevronDown,
	Menu,
	Moon,
	Search,
	Star,
	Sun,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
} from "chart.js";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useCryptoStore } from "@/store/useCryptoStore";
import { useCryptos } from "@/hooks/useCrypto";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import Loader from "./Loader";
import NoCoinsFound from "./NoCoinsFound";
import { useRouter } from "next/navigation";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
);

export default function CryptoDashboard() {
	const [darkMode, setDarkMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const { favorites,  toggleFavorite, isFavorite } = useFavoriteStore(); 
	const { currency } = useCryptoStore();
	const { data, isLoading, error } = useCryptos(currency);
    const router = useRouter();

	if (isLoading) return <Loader/>;
	if (error) return <p>Error loading data</p>;

    
	// Filter cryptocurrencies based on search query
	const filteredCryptos = data?.filter(
        (crypto) =>
			crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
	);
    
    const displayCryptos =
            activeTab === "favorites"
                ? filteredCryptos?.filter((crypto) => favorites.includes(crypto.id))
                : filteredCryptos;

	// Toggle dark mode
	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle("dark");
	};

	// Format large numbers for readability
	const formatNumber = (num: number) => {
		if (num >= 1_000_000_000_000) {
			return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
		} else if (num >= 1_000_000_000) {
			return `$${(num / 1_000_000_000).toFixed(2)}B`;
		} else if (num >= 1_000_000) {
			return `$${(num / 1_000_000).toFixed(2)}M`;
		} else {
			return `$${num.toLocaleString()}`;
		}
	};

	// Safely get sparkline data or fallback to empty array
	const getSparkline = (crypto: any) => {
		return crypto.sparkline_in_7d?.price || [];
	};

	return (
		<div
			className={`min-h-screen min-w-screen bg-background ${darkMode ? "dark" : ""}`}
		>
			<header className='sticky top-0 z-10 border-b bg-background'>
				<div className='container flex h-16 items-center justify-between px-4'>
					<div className='flex items-center gap-4'>
						<Button variant='ghost' size='icon' className='md:hidden'>
							<Menu className='h-6 w-6' />
							<span className='sr-only'>Toggle menu</span>
						</Button>
						<h1 className='text-xl font-bold'>CryptoTracker</h1>
					</div>
					<div className='hidden md:flex md:flex-1 md:items-center md:justify-center'>
						<div className='relative w-full max-w-md'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search cryptocurrencies...'
								className='w-full bg-background pl-8'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<Button variant='ghost' size='icon' onClick={toggleDarkMode}>
							{darkMode ? (
								<Sun className='h-5 w-5' />
							) : (
								<Moon className='h-5 w-5' />
							)}
							<span className='sr-only'>Toggle theme</span>
						</Button>
						<Button variant='ghost' size='icon'>
							<Bell className='h-5 w-5' />
							<span className='sr-only'>Notifications</span>
						</Button>
					</div>
				</div>
			</header>

			<main className='container px-4 py-6 '>
				<div className='flex justify-between '>
					<h2 className='text-2xl font-bold mb-4'>Market Overview</h2>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className='h-8'>
							<TabsTrigger value='all' className='text-xs'>
								All
							</TabsTrigger>
							<TabsTrigger value='favorites' className='text-xs'>
								Favorites
							</TabsTrigger>
							<TabsTrigger value='trending' className='text-xs'>
								Trending
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				{
                    displayCryptos?.length === 0 ? (
					<NoCoinsFound />
				) : (
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{displayCryptos?.map((crypto) => {
						const sparklineData = getSparkline(crypto);
						const hasData = sparklineData.length > 0;

						return (
							<Card
								key={crypto.id}
								className='overflow-hidden shadow-md cursor-pointer'
								onClick={() => router.push(`/${crypto.id}`)}
							>
								<CardContent className='px-8 py-5'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<img
												src={crypto.image || "/placeholder.svg"}
												alt={crypto.name}
												className='h-10 w-10 rounded-full'
											/>
											<div>
												<h3 className='font-semibold'>{crypto.name}</h3>
												<p className='text-xs text-muted-foreground'>
													{crypto.symbol.toUpperCase()}
												</p>
												<p className='text-sm text-muted-foreground'>
													Market Cap: {formatNumber(crypto.market_cap)}
												</p>
											</div>
										</div>
										{/* Favorite Button */}
										<Button
											variant='ghost'
											size='icon'
											className={`h-8 w-8 ${
												isFavorite(crypto.id)
													? "bg-yellow-500 text-gray-50"
													: "bg-gray-50 text-gray-500"
											}`}
											onClick={() => toggleFavorite(crypto.id)}
										>
											<Star className='h-4 w-4' />
											<span className='sr-only'>Add to favorites</span>
										</Button>
									</div>

									<div className='my-4'>
										<p className='text-3xl font-bold'>
											${crypto.current_price.toLocaleString()}
										</p>
										<div
											className={`flex items-center ${
												crypto.price_change_percentage_24h >= 0
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{crypto.price_change_percentage_24h >= 0 ? (
												<ArrowUp className='mr-1 h-4 w-4' />
											) : (
												<ArrowDown className='mr-1 h-4 w-4' />
											)}
											<span className='text-sm font-medium'>
												{crypto.price_change_percentage_24h.toFixed(2)}%
											</span>
										</div>
									</div>

									<div className='h-32'>
										{hasData ? (
											<Line
												data={{
													labels: Array(sparklineData.length).fill(""), // Empty labels
													datasets: [
														{
															data: sparklineData,
															borderColor:
																crypto.price_change_percentage_24h >= 0
																	? "#10b981"
																	: "#ef4444",
															borderWidth: 2,
															tension: 0.4,
															pointRadius: 0,
															fill: false, // No background fill
														},
													],
												}}
												options={{
													responsive: true,
													maintainAspectRatio: false,
													plugins: {
														legend: { display: false }, // Remove graph label
														tooltip: { enabled: true }, // Keep tooltips
													},
													scales: {
														x: {
															display: false, // Hide x-axis
															grid: { display: false }, // Remove x-axis grid lines
														},
														y: {
															display: false, // Hide y-axis
															grid: { display: false }, // Remove y-axis grid lines
														},
													},
												}}
											/>
										) : (
											<p className='text-center text-sm text-gray-400'>
												No data available
											</p>
										)}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>)
                }
			</main>
		</div>
	);
}
