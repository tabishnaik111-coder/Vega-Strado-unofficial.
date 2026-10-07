import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getProducts } from "../../services/api";

const collectionStyles = [
{
color: "coral",
accent: "coral",
symbol: "V",
},
{
color: "yellow",
accent: "yellow",
symbol: "S",
},
{
color: "blue",
accent: "blue",
symbol: "V",
},
{
color: "green",
accent: "green",
symbol: "S",
},
];

function formatCategoryName(category) {
if (!category) {
return "";
}

return category
.replace(/[-_]+/g, " ")
.replace(/\s+/g, " ")
.trim()
.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getProductImage(product) {
return (
product?.image ||
product?.images?.[0] ||
product?.product?.image ||
product?.product?.images?.[0] ||
""
);
}

function Collections() {
const [collections, setCollections] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
let isMounted = true;


const loadCollections = async () => {
  try {
    setLoading(true);

    const result = await getProducts();

    const products = Array.isArray(result)
      ? result
      : result?.products || [];

    const categoryMap = new Map();

    products.forEach((product) => {
      const category =
        product?.category?.toString().trim();

      if (!category) {
        return;
      }

      const normalizedCategory =
        category.toLowerCase();

      if (!categoryMap.has(normalizedCategory)) {
        categoryMap.set(normalizedCategory, {
          name: category,
          image: getProductImage(product),
        });
        return;
      }

      const existingCategory =
        categoryMap.get(normalizedCategory);

      if (
        !existingCategory.image &&
        getProductImage(product)
      ) {
        existingCategory.image =
          getProductImage(product);
      }
    });

    const liveCategories = Array.from(
      categoryMap.values()
    );

    const liveCollections = liveCategories.map(
      (category, index) => {
        const style =
          collectionStyles[
            index % collectionStyles.length
          ];

        return {
          id: `category-${category.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`,
          title: formatCategoryName(category.name),
          eyebrow: "SHOP CATEGORY",
          image: category.image,
          ...style,
        };
      }
    );

    if (isMounted) {
      setCollections(liveCollections);
    }
  } catch (error) {
    console.error(
      "Failed to load Home categories:",
      error
    );

    if (isMounted) {
      setCollections([]);
    }
  } finally {
    if (isMounted) {
      setLoading(false);
    }
  }
};

loadCollections();

return () => {
  isMounted = false;
};

}, []);

return ( <section
   className="vega-collections"
   aria-labelledby="collections-title"
 > <div className="vega-collections__intro">
<motion.span
className="vega-section-eyebrow"
initial={{
opacity: 0,
y: 15,
}}
whileInView={{
opacity: 1,
y: 0,
}}
viewport={{
once: true,
}}
transition={{
duration: 0.5,
ease: [0.22, 1, 0.36, 1],
}}
>
EXPLORE THE WORLD
</motion.span>

    <motion.h2
      id="collections-title"
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
        delay: 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      FIND YOUR
      <br />
      <span>STRADO.</span>
    </motion.h2>

    <motion.p
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
        delay: 0.16,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      Different moods. Different moments.
      <br />
      One unmistakable identity.
    </motion.p>
  </div>

  <div className="vega-collections__viewport">
    {loading ? (
      <div className="vega-collections__track">
        <div className="vega-collection-card">
          <div className="vega-collection-card__center">
            <span>LOADING...</span>
          </div>
        </div>
      </div>
    ) : collections.length > 0 ? (
      <div className="vega-collections__track">
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </div>
    ) : (
      <div className="vega-collections__track">
        <div className="vega-collection-card">
          <div className="vega-collection-card__center">
            <span>
              NO CATEGORIES AVAILABLE
            </span>
          </div>
        </div>
      </div>
    )}
  </div>
</section>

);
}

function CollectionCard({
collection,
index,
}) {
const [imageFailed, setImageFailed] = useState(false);

const hasImage =
Boolean(collection.image) && !imageFailed;

return (
<motion.article
className={`vega-collection-card vega-collection-card--${collection.color}`}
initial={{
opacity: 0,
y: 30,
}}
whileInView={{
opacity: 1,
y: 0,
}}
viewport={{
once: true,
amount: 0.15,
}}
transition={{
duration: 0.65,
delay: index * 0.08,
ease: [0.22, 1, 0.36, 1],
}}
whileHover={{
y: -8,
}}
> <div className="vega-collection-card__top"> <span className="vega-collection-card__eyebrow">
{collection.eyebrow} </span> </div>


  <div className="vega-collection-card__center">
    {hasImage ? (
      <motion.img
        src={collection.image}
        alt={`${collection.title} collection`}
        className="vega-collection-card__image"
        loading="lazy"
        onError={() => setImageFailed(true)}
        whileHover={{
          scale: 1.06,
          y: -5,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 15,
        }}
      />
    ) : (
      <motion.div
        className={`vega-collection-card__symbol vega-collection-card__symbol--${collection.accent}`}
        whileHover={{
          rotate: index % 2 === 0 ? 8 : -8,
          scale: 1.06,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 15,
        }}
      >
        {collection.symbol}
      </motion.div>
    )}
  </div>

  <div className="vega-collection-card__bottom">
    <div>
      <h3>{collection.title}</h3>
    </div>

    <motion.button
      type="button"
      className="vega-collection-card__arrow"
      whileHover={{
        scale: 1.08,
        rotate: 5,
      }}
      whileTap={{
        scale: 0.92,
      }}
      aria-label={`Explore ${collection.title} category`}
    >
      ↗
    </motion.button>
  </div>

  <span className="vega-collection-card__number">
    {String(index + 1).padStart(2, "0")}
  </span>
</motion.article>

);
}

export default Collections;
