import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3";

interface Crypto {
	id: string;
	symbol: string;
	name: string;
	current_price: number;
	market_cap: number;
	total_volume: number;
	image: string;
}

const fetchCryptos = async (currency: string): Promise<Crypto[]> => {
	const { data } = await axios.get(
		`${API_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=true`
	);
    console.log(data);
	return data;
};

export const useCryptos = (
	currency: string
): UseQueryResult<Crypto[], Error> => {
	return useQuery({
		queryKey: ["cryptos", currency],
		queryFn: () => fetchCryptos(currency),
	});
};
