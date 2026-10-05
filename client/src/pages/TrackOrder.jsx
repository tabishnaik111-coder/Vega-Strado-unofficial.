import { Container, Section } from "../components/layout";

function TrackOrder() {
  return (
    <Section>
      <Container>

        <span className="vega-badge vega-badge-mint">
          TRACK ORDER
        </span>

        <h1 className="vega-heading-lg">
          Where's my order?
        </h1>

        <p className="vega-text-lg vega-text-secondary">
          Enter your order information to track
          your Vega Strado delivery.
        </p>

      </Container>
    </Section>
  );
}

export default TrackOrder;