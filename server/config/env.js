const requiredProductionEnv = [
  "MONGODB_URI",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "PRINTIFY_API_KEY",
  "PRINTIFY_SHOP_ID",
  "PRINTIFY_WEBHOOK_SECRET",
  "CLIENT_URL",
];

function validateEnvironment() {
  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    return;
  }

  const missing =
    requiredProductionEnv.filter(
      (key) =>
        !process.env[key]
    );

  if (missing.length > 0) {
    console.error(
      "Missing production environment variables:"
    );

    missing.forEach((key) => {
      console.error(`- ${key}`);
    });

    process.exit(1);
  }
}

export default validateEnvironment;