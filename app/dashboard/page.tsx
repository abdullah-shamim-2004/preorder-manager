import Link from "next/link";
import React from "react";

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <Link className="text-blue-500" href={"/dashboard/preorderForm"}> create </Link>
    </div>
  );
}
