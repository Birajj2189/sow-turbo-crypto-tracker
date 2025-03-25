"use client";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export default function NoCoinsFound() {
	return (
		<motion.div
			className='flex flex-col items-center justify-center h-64 text-center'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5, ease: "easeInOut" }}
		>
			<SearchX className='w-16 h-16 text-red-500' />
			<h2 className='text-2xl font-bold mt-4'>No Coins Found</h2>
			<p className='text-muted-foreground'>Try a different search query.</p>
		</motion.div>
	);
}
