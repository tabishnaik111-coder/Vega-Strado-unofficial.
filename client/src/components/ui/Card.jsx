function Card({
  children,
  tint,
  padding = true,
  className = "",
}) {
  const classes = [
    "vega-card",
    tint ? `vega-card-${tint}` : "",
    padding ? "vega-card-padding" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export default Card;