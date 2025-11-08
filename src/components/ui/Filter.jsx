export default function Filter({ brandFilter, setBrandFilter, maxPrice, setMaxPrice }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        placeholder="Brand"
        value={brandFilter}
        onChange={e => setBrandFilter(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
      />
    </div>
  );
}
