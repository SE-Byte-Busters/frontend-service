import React from "react";

export default function page({ params }: { params: { "sign-in"?: string[] } }) {
  return <div>{JSON.stringify(params)}</div>;
}
