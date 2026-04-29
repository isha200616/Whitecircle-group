export function verifyGSTIN(gstin) {
  const valid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin);
  return {
    gstin,
    valid,
    legalName: valid ? "WhiteCircle Verified Business Pvt Ltd" : null,
    status: valid ? "Active" : "Invalid",
    source: "mock"
  };
}
