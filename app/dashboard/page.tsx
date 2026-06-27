import PreorderList from "@/components/preorders/preorder-list";
import { db } from "@/lib/prisma";


export default async function Dashboard() {
  const preorders = await db.preorder.findMany({
    orderBy: { createdAt: "desc" },
  });
  // console.log(preorders);
  const serialized = preorders.map((p) => ({
    id: p.id,
    name: p.name,
    products: p.products,
    preorderWhen: p.preorderWhen as "REGARDLESS_OF_STOCK" | "WHEN_OUT_OF_STOCK",
    startsAt: p.startsAt.toISOString(),
    endsAt: p.endsAt ? p.endsAt.toISOString() : null,
    status: p.status,
  }));
  // console.log(serialized);

  return <PreorderList initialData={serialized}></PreorderList>;
}
