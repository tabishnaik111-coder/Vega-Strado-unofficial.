function Container({
  children,
  wide = false,
  className = "",
}) {
  const classes = [
    wide ? "vega-container-wide" : "vega-container",
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

export default Container;