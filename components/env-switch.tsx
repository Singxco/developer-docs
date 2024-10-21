"use client";

export default function EnvSwitch() {
  const host_UAT = "https://external-api-uat.singx.co/business";
  const host_PROD = "https://external-api.singx.co/business";

  return (
    <div>
      <h1>Environment</h1>
      <p className="mt-2">
        <i>UAT:</i> {host_UAT}
      </p>
      <p className="mt-2">
        <i>PROD:</i> {host_PROD}
      </p>
    </div>
  );
}
