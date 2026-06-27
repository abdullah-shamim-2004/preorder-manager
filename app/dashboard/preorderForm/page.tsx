import PreorderForm from "@/components/preorders/PreorderForm";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Intrface of the props
interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function preorderFormPage({ searchParams }: Props) {
  const { id } = await searchParams;
  if (id) {
    const preorder = await db.preorder.findUnique({ where: { id } });
    if (!preorder) notFound();

    return (
      <PreorderForm
        mode="update"
        initialData={{
          id: preorder.id,
          name: preorder.name,
          products: preorder.products,
          preorderWhen: preorder.preorderWhen as
            | "REGARDLESS_OF_STOCK"
            | "WHEN_OUT_OF_STOCK",
          startsAt: preorder.startsAt.toISOString().slice(0, 16),
          endsAt: preorder.endsAt
            ? preorder.endsAt.toISOString().slice(0, 16)
            : "",
          status: preorder.status,
        }}
      />
    );
  }
  // if there is no id
  return <PreorderForm mode="create" />;
}
