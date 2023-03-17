import { useState, useEffect } from "react";
import { getNFTsForCollection } from "../api/nftApi";
import "./Gallery.css";
import Modal from 'react-modal';
import MetamaskButton from '../components/MetamaskButton';
import GemIcon from '../images/gem.png';
import FiltersIcon from '../images/filters.png';
import FiltersModal from '../components/FiltersModal';
import './GalleryToolbar.css';


const Gallery = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [nftsPerPage, setNftsPerPage] = useState(20);
  const [nfts, setNfts] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedNFT, setSelectedNFT] = useState(null);
  
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prevShowFilters) => !prevShowFilters);
  };

const handleScroll = (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

  if (scrollHeight - scrollTop === clientHeight) {
      setCurrentPage(currentPage + 1);
  }
};

useEffect(() => {
  const collectionSlug = "azuki";
  const offset = currentPage * nftsPerPage;
  const limit = nftsPerPage;

  getNFTsForCollection(collectionSlug, filters, offset, limit).then((nfts) => {
      setNfts(nfts);
  });
}, [currentPage, filters, nftsPerPage]);


const getGemLink = (collectionAddress, tokenId) => {
  return `https://www.gem.xyz/asset/${collectionAddress}/${tokenId}`;
};

const [searchValue, setSearchValue] = useState('');
const [sortOrder, setSortOrder] = useState('asc');
const activeFiltersCount = Object.values(filters).filter((value) => value !== '').length;


const handleFilterChange = (filter, value) => {
  // Update filters object with new value
  setFilters({
      ...filters,
      [filter]: value,
  });
};

const filteredNFTs = nfts.filter((nft) => {
  let match = true;

  Object.entries(filters).forEach(([filter, value]) => {
      if (value && !nft.traits.find((trait) => trait.trait_type === filter && trait.value.toLowerCase() === value.toLowerCase())) {
          match = false;
      } else if (!value) {
          // If the filter value is empty, do not apply the filter to the NFT
          return;
      }
  });

  console.log(nft, match); // Ajouter cette ligne pour vérifier si les filtres sont appliqués

  return match;
});

const openNFTModal = (nft) => {
  // Add Gem link to NFT object
  nft.gemLink = getGemLink(nft.asset_contract.address, nft.token_id);

  // Open modal to display NFT details
  setSelectedNFT(nft);
};

const closeModal = () => {
  setSelectedNFT(null);
}

return (
  <div className="page">
    <div className="title-container">
        <h2>GALLERY</h2>
      </div>
    <div className="outside-nav">
  <MetamaskButton />
</div>

<div className="gallery-toolbar">
  <div className="active-filters">
    Active filters: {activeFiltersCount}
  </div>
  <div className="sort-order">
    Sort by #:
    <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search by #"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  </div>
</div>

<div className="main-container">
        <FiltersModal
           handleFilterChange={handleFilterChange}
           showModal={showFilters}
           toggleModal={toggleFilters}
        />

      <div className="nft-grid">
          {filteredNFTs.map((nft) => (
              <div key={nft.id} className="nft-item" onClick={() => setSelectedNFT(nft)}>
                  <img src={nft.image_url} alt={nft.name} />
                  <div className="nft-details">
                  <div className="nft-text">
                  <span>Bloody Pirate </span>
                  <span className="nft-number">#{nft.token_id}</span></div>
                      <button className="gem-link-btn" onClick={() => window.open(nft.gemLink, '_blank')}>
                          <img src={GemIcon} alt="Gem icon" />
                          <span>See on Gem.xyz</span>
                      </button>
                      {/* Add more NFT details here */}
                  </div>
              </div>
          ))}
      </div></div>
      
      <button className="floating-button" onClick={toggleFilters}>
  <img src={FiltersIcon} alt="Filters" />
</button>



      

      <Modal
  isOpen={selectedNFT !== null}
  onRequestClose={closeModal}
  contentLabel="NFT Details"
  style={{
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.8)'
    },
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '1200px',
        maxHeight: '550px',
        width: '90%',
        height: '80%'
    }
}}

>
          {selectedNFT && (
  <div className="modal-content">
    <div className="modal-image">
      <img src={selectedNFT.image_url} alt={selectedNFT.name} />
    </div>
    <div className="modal-details">
        <h3>#{selectedNFT.token_id}</h3>
        <div className="trait-list">
          <div className="trait-column">
            {selectedNFT.traits.slice(0, Math.ceil(selectedNFT.traits.length / 2)).map((trait) => (
              <div className="trait-item" key={trait.trait_type}>
                <div className="trait-label">{trait.trait_type}:</div>
                <div className="trait-value">{trait.value}</div>
              </div>
            ))}
          </div>
          <div className="trait-column">
            {selectedNFT.traits.slice(Math.ceil(selectedNFT.traits.length / 2)).map((trait) => (
              <div className="trait-item" key={trait.trait_type}>
                <div className="trait-label">{trait.trait_type}:</div>
                <div className="trait-value">{trait.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}
</Modal>
</div>
);
            };
export default Gallery;
