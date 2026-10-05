import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import ProductCard from "../components/product/ProductCard";
import {
  getProducts,
  getFilterOptions,
} from "../services/api";

function Shop() {
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    sizes: [],
    colors: [],
  });

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    size: "",
    color: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  async function loadFilterOptions() {
    try {
      setFiltersLoading(true);

      const options = await getFilterOptions();

      setFilterOptions({
        categories: options.categories || [],
        sizes: options.sizes || [],
        colors: options.colors || [],
      });
    } catch (error) {
      console.error("Filter options error:", error);
    } finally {
      setFiltersLoading(false);
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const result = await getProducts(filters);

      setProducts(result.products || []);
    } catch (error) {
      console.error("Shop products error:", error);

      setError(
        error.message || "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      search: "",
      category: "",
      size: "",
      color: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    });
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== ""
  );

  return (
    <div className="vega-shop">
      <section className="vega-shop__hero">
        <div className="vega-shop__hero-inner">
          <motion.span
            className="vega-section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            THE VEGA STORE
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            SHOP
            <span> THE DROP.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.16,
            }}
          >
            Find your everyday essentials, streetwear
            staples and pieces made to stand out.
          </motion.p>
        </div>
      </section>

      <section className="vega-shop__content">
        <div className="vega-shop__toolbar">
          <div className="vega-shop__search">
            <label htmlFor="shop-search">
              Search products
            </label>

            <input
              id="shop-search"
              type="search"
              placeholder="Search..."
              value={filters.search}
              onChange={(event) =>
                updateFilter(
                  "search",
                  event.target.value
                )
              }
            />
          </div>

          <div className="vega-shop__sort">
            <label htmlFor="shop-sort">Sort</label>

            <select
              id="shop-sort"
              value={filters.sort}
              onChange={(event) =>
                updateFilter(
                  "sort",
                  event.target.value
                )
              }
            >
              <option value="">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="name">
                Name: A to Z
              </option>
            </select>
          </div>
        </div>

        <div className="vega-shop__layout">
          <aside className="vega-shop__filters">
            <div className="vega-shop__filters-header">
              <h2>FILTERS</h2>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            <FilterGroup title="Category">
              {filtersLoading ? (
                <span className="vega-shop__filter-loading">
                  Loading...
                </span>
              ) : (
                filterOptions.categories.map(
                  (category) => (
                    <FilterButton
                      key={category}
                      active={
                        filters.category === category
                      }
                      onClick={() =>
                        updateFilter(
                          "category",
                          filters.category === category
                            ? ""
                            : category
                        )
                      }
                    >
                      {category}
                    </FilterButton>
                  )
                )
              )}
            </FilterGroup>

            <FilterGroup title="Size">
              {filtersLoading ? (
                <span className="vega-shop__filter-loading">
                  Loading...
                </span>
              ) : (
                <div className="vega-shop__size-grid">
                  {filterOptions.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={
                        filters.size === size
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        updateFilter(
                          "size",
                          filters.size === size
                            ? ""
                            : size
                        )
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </FilterGroup>

            <FilterGroup title="Color">
              {filtersLoading ? (
                <span className="vega-shop__filter-loading">
                  Loading...
                </span>
              ) : (
                filterOptions.colors.map((color) => (
                  <FilterButton
                    key={color}
                    active={
                      filters.color === color
                    }
                    onClick={() =>
                      updateFilter(
                        "color",
                        filters.color === color
                          ? ""
                          : color
                      )
                    }
                  >
                    {color}
                  </FilterButton>
                ))
              )}
            </FilterGroup>

            <FilterGroup title="Price">
              <div className="vega-shop__price-inputs">
                <div>
                  <label htmlFor="min-price">
                    Min
                  </label>

                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    placeholder="₹0"
                    value={filters.minPrice}
                    onChange={(event) =>
                      updateFilter(
                        "minPrice",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label htmlFor="max-price">
                    Max
                  </label>

                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    placeholder="₹5000"
                    value={filters.maxPrice}
                    onChange={(event) =>
                      updateFilter(
                        "maxPrice",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </FilterGroup>
          </aside>

          <div className="vega-shop__products">
            <div className="vega-shop__products-header">
              <span>
                {loading
                  ? "Loading..."
                  : `${products.length} ${
                      products.length === 1
                        ? "product"
                        : "products"
                    }`}
              </span>
            </div>

            {loading ? (
              <LoadingGrid />
            ) : error ? (
              <ErrorState
                message={error}
                onRetry={loadProducts}
              />
            ) : products.length === 0 ? (
              <EmptyState
                onClear={clearFilters}
                hasFilters={hasActiveFilters}
              />
            ) : (
              <motion.div
                className="vega-shop__grid"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.06,
                    },
                  },
                }}
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 25,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.45,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        },
                      },
                    }}
                  >
                    <ProductCard
                      product={{
                        ...product,
                        name: product.title,
                        price: product.price,
                        category: product.category,
                        color: getCardColor(product),
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div className="vega-shop__filter-group">
      <h3>{title}</h3>

      <div className="vega-shop__filter-options">
        {children}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      className={`vega-shop__filter-button ${
        active ? "is-active" : ""
      }`}
      onClick={onClick}
    >
      <span>{children}</span>
      <span>{active ? "✓" : "+"}</span>
    </button>
  );
}

function LoadingGrid() {
  return (
    <div className="vega-shop__grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          className="vega-shop__skeleton"
          key={index}
        >
          <div className="vega-shop__skeleton-image" />

          <div className="vega-shop__skeleton-line" />

          <div className="vega-shop__skeleton-line vega-shop__skeleton-line--short" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="vega-shop__state">
      <span>!</span>

      <h2>Something went wrong.</h2>

      <p>{message}</p>

      <button type="button" onClick={onRetry}>
        TRY AGAIN
      </button>
    </div>
  );
}

function EmptyState({ onClear, hasFilters }) {
  return (
    <div className="vega-shop__state">
      <span>✦</span>

      <h2>No pieces found.</h2>

      <p>
        Try changing your filters or search for
        something else.
      </p>

      {hasFilters && (
        <button type="button" onClick={onClear}>
          CLEAR FILTERS
        </button>
      )}
    </div>
  );
}

function getCardColor(product) {
  const colors = product.colors || [];

  const color = colors[0]?.toLowerCase() || "";

  if (color.includes("red")) return "coral";
  if (color.includes("yellow")) return "yellow";
  if (
    color.includes("blue") ||
    color.includes("navy")
  ) {
    return "blue";
  }

  if (
    color.includes("green") ||
    color.includes("olive")
  ) {
    return "green";
  }

  return "cream";
}

export default Shop;