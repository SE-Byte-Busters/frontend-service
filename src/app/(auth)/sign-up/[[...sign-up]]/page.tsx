import React from "react";

export default function page({ params }: { params: string[] }) {
  return <div className="text-3xl">{JSON.stringify(params)}</div>;
}
