import { useEffect, useMemo, useState } from "react";

function VariantSelector({
  variants = [],
  sizes = [],
  colors = [],
  onVariantChange,
}) {
  const availableVariants = useMemo(
    () => variants.filter((variant) => variant.available !== false),
    [variants]
  );

  const sizeOptions = useMemo(() => {
    if (sizes.length) {
      return sizes;
    }

    return extractOptionValues(
      availableVariants,
      "size"
    );
  }, [sizes, availableVariants]);

  const colorOptions = useMemo(() => {
    if (colors.length) {
      return colors;
    }

    return extractOptionValues(
      availableVariants,
      "color"
    );
  }, [colors, availableVariants]);

  const [selectedSize, setSelectedSize] = useState(
    sizeOptions[0] || ""
  );

  const [selectedColor, setSelectedColor] = useState(
    colorOptions[0] || ""
  );

  useEffect(() => {
    setSelectedSize(sizeOptions[0] || "");
  }, [sizeOptions.join("|")]);

  useEffect(() => {
    setSelectedColor(colorOptions[0] || "");
  }, [colorOptions.join("|")]);

  const selectedVariant = useMemo(() => {
    return availableVariants.find((variant) => {
      const options = getVariantOptions(variant);

      const matchesSize =
        !selectedSize ||
        options.size?.toLowerCase() ===
          selectedSize.toLowerCase();

      const matchesColor =
        !selectedColor ||
        options.color?.toLowerCase() ===
          selectedColor.toLowerCase();

      return matchesSize && matchesColor;
    }) || null;
  }, [
    availableVariants,
    selectedSize,
    selectedColor,
  ]);

  useEffect(() => {
    onVariantChange?.({
      variant: selectedVariant,
      size: selectedSize,
      color: selectedColor,
    });
  }, [
    selectedVariant,
    selectedSize,
    selectedColor,
    onVariantChange,
  ]);

  function handleSizeChange(size) {
    setSelectedSize(size);
  }

  function handleColorChange(color) {
    setSelectedColor(color);
  }

  if (!availableVariants.length) {
    return (
      <div className="vega-variant-selector__empty">
        No variants available.
      </div>
    );
  }

  return (
    <div className="vega-variant-selector">
      {sizeOptions.length > 0 && (
        <div className="vega-variant-selector__group">
          <div className="vega-variant-selector__heading">
            <span>SIZE</span>
            {selectedSize && (
              <strong>{selectedSize}</strong>
            )}
          </div>

          <div className="vega-variant-selector__options">
            {sizeOptions.map((size) => {
              const available = isOptionAvailable(
                availableVariants,
                "size",
                size,
                selectedColor
              );

              const active = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  className={`vega-variant-selector__size ${
                    active ? "is-active" : ""
                  } ${!available ? "is-disabled" : ""}`}
                  onClick={() => handleSizeChange(size)}
                  aria-pressed={active}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colorOptions.length > 0 && (
        <div className="vega-variant-selector__group">
          <div className="vega-variant-selector__heading">
            <span>COLOR</span>
            {selectedColor && (
              <strong>{selectedColor}</strong>
            )}
          </div>

          <div className="vega-variant-selector__options vega-variant-selector__options--colors">
            {colorOptions.map((color) => {
              const available = isOptionAvailable(
                availableVariants,
                "color",
                color,
                selectedSize
              );

              const active = selectedColor === color;

              return (
                <button
                  key={color}
                  type="button"
                  disabled={!available}
                  className={`vega-variant-selector__color ${
                    active ? "is-active" : ""
                  } ${!available ? "is-disabled" : ""}`}
                  onClick={() =>
                    handleColorChange(color)
                  }
                  aria-pressed={active}
                >
                  <span
                    className="vega-variant-selector__color-dot"
                    style={{
                      background: getColorValue(color),
                    }}
                  />

                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="vega-variant-selector__status">
        {selectedVariant ? (
          <>
            <span className="vega-variant-selector__status-dot" />
            <span>
              {selectedVariant.quantity !== undefined &&
              selectedVariant.quantity !== null
                ? `${selectedVariant.quantity} available`
                : "Available"}
            </span>
          </>
        ) : (
          <>
            <span className="vega-variant-selector__status-dot vega-variant-selector__status-dot--off" />
            <span>
              This combination is unavailable.
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function getVariantOptions(variant) {
  const result = {
    size: "",
    color: "",
  };

  if (!variant?.options) {
    return result;
  }

  variant.options.forEach((option) => {
    const name =
      option.name?.toLowerCase() ||
      option.option_name?.toLowerCase() ||
      "";

    const value = option.value;

    if (!value) {
      return;
    }

    if (name === "size") {
      result.size = String(value);
    }

    if (name === "color" || name === "colour") {
      result.color = String(value);
    }
  });

  return result;
}

function extractOptionValues(variants, type) {
  const values = new Set();

  variants.forEach((variant) => {
    const options = getVariantOptions(variant);

    if (options[type]) {
      values.add(options[type]);
    }
  });

  return [...values];
}

function isOptionAvailable(
  variants,
  type,
  value,
  otherSelection
) {
  return variants.some((variant) => {
    const options = getVariantOptions(variant);

    if (
      options[type]?.toLowerCase() !==
      value.toLowerCase()
    ) {
      return false;
    }

    if (!otherSelection) {
      return true;
    }

    const otherType =
      type === "size" ? "color" : "size";

    return (
      options[otherType]?.toLowerCase() ===
      otherSelection.toLowerCase()
    );
  });
}

function getColorValue(color) {
  const value = color.toLowerCase();

  if (value.includes("black")) return "#1C1B22";
  if (value.includes("white")) return "#FFFFFF";
  if (value.includes("cream")) return "#FFF6EA";
  if (value.includes("red")) return "#FF6B4A";
  if (value.includes("coral")) return "#FF6B4A";
  if (value.includes("yellow")) return "#FFD66B";
  if (value.includes("gold")) return "#D9A441";
  if (value.includes("blue")) return "#526BFF";
  if (value.includes("navy")) return "#182447";
  if (value.includes("green")) return "#4E7A5A";
  if (value.includes("olive")) return "#697044";
  if (value.includes("pink")) return "#E99BB5";
  if (value.includes("purple")) return "#8064A2";
  if (value.includes("grey")) return "#8C8C8C";
  if (value.includes("gray")) return "#8C8C8C";
  if (value.includes("brown")) return "#795548";
  if (value.includes("orange")) return "#E8863A";

  return "#D8D0C5";
}

export default VariantSelector;