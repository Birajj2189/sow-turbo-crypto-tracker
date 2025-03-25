import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3";

interface CryptoDetail {
	id: string;
	symbol: string;
	name: string;
	image: { large: string };
	market_data: {
		current_price: { usd: number };
		market_cap: { usd: number };
		total_volume: { usd: number };
		price_change_percentage_24h: number;
		ath: { usd: number };
		atl: { usd: number };
	};
	description: { en: string };
	last_updated: string;
}

const fetchCryptoById = async (id: string): Promise<CryptoDetail> => {
	const { data } = await axios.get(`${API_URL}/coins/${id}`);
	return data;
};

export const useCryptoById = (
	id: string
): UseQueryResult<CryptoDetail, Error> => {
	return useQuery({
		queryKey: ["crypto", id],
		queryFn: () => fetchCryptoById(id),
		enabled: !!id, // Only fetch if id is available
	});
};
