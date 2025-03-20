import React from "react";

export default function page({ params }: { params: string[] }) {
  return <div>{JSON.stringify(params)}</div>;
}
