function Section({
  children,
  size = "default",
  className = "",
  id,
}) {
  const sectionClass =
    size === "small"
      ? "vega-section-sm"
      : size === "large"
        ? "vega-section-lg"
        : "vega-section";

  const classes = [
    sectionClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={id}
      className={classes}
    >
      {children}
    </section>
  );
}

export default Section;