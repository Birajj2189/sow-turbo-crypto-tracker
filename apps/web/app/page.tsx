import CryptoList from "./components/CryptoList";

export default function Home() {
	return (
		<main className='min-h-screen p-4'>
			{/* <h1 className='text-3xl font-bold'>Crypto Tracker</h1> */}
			<CryptoList />
		</main>
	);
}
