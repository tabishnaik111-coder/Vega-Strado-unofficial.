import { Link } from "react-router-dom";

function Button({
  children,
  variant = "primary",
  size = "default",
  to,
  type = "button",
  className = "",
  ...props
}) {
  const classes = [
    "vega-button",
    `vega-button-${variant}`,
    size !== "default" ? `vega-button-${size}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;