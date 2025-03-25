"use client";

import { useEffect, useState } from "react";
import { Bitcoin, Coins, TrendingUp } from "lucide-react";

export default function CryptoLoading() {
	const [loadingText, setLoadingText] = useState("Fetching data...");
	const loadingMessages = [
		"Fetching crypto prices...",
		"Loading market trends...",
		"Analyzing volatility...",
		"Syncing with the blockchain...",
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingText(
				loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
			);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='flex items-center justify-center min-h-screen bg-white'>
			<div className='relative flex items-center justify-center'>
				{/* Rotating Icons */}
				<div className='absolute animate-spin-slow'>
					<Coins className='w-24 h-24 text-yellow-500' />
				</div>
				<div className='absolute animate-spin-reverse'>
					<Bitcoin className='w-20 h-20 text-orange-500' />
				</div>
				<div className='absolute animate-pulse'>
					<TrendingUp className='w-16 h-16 text-green-500' />
				</div>

				{/* Glowing Ring */}
				<div className='absolute w-40 h-40 rounded-full border-4 border-dashed border-gray-300 animate-ping' />

				{/* Loading Text */}
				<div className='relative z-10 text-center'>
					<p className='text-lg font-bold text-gray-700'>{loadingText}</p>
				</div>
			</div>
		</div>
	);
}
