import axios from "axios";

const OPENSEA_API_URL = "https://api.opensea.io/api/v1";


export const getNFTsForCollection = (collectionSlug, filters) => {
    let url = `${OPENSEA_API_URL}/assets?collection=${collectionSlug}`;

    if (filters && filters.rarity) {
        const filterName = 'traits.rarity';
        const filterValue = filters.rarity;
        url += `&${filterName}=${filterValue}`;
    }

    console.log('Fetching NFTs with URL:', url);

    return axios.get(url).then((response) => {
        const nfts = response.data.assets.map(nft => {
            const gemLink = `https://www.gem.xyz/asset/${nft.asset_contract.address}/${nft.token_id}`;
            return {...nft, gemLink };
        });
        console.log('Fetched NFTs:', nfts);
        return nfts;
    }).catch(error => {
        console.error('Error fetching NFTs:', error);
        return [];
    });
};
