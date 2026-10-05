import { Link } from "react-router-dom";
import { Container, Section } from "../components/layout";

function NotFound() {
  return (
    <Section size="large">
      <Container>

        <span className="vega-badge vega-badge-coral">
          404
        </span>

        <h1 className="vega-heading-lg">
          Lost in space.
        </h1>

        <p className="vega-text-lg vega-text-secondary">
          This page doesn't exist.
        </p>

        <div style={{ marginTop: "24px" }}>
          <Link
            to="/"
            className="vega-button vega-button-primary"
          >
            Back Home
          </Link>
        </div>

      </Container>
    </Section>
  );
}

export default NotFound;