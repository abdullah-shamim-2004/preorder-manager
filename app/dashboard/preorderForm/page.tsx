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
        initialData={{ ...preorder, id: preorder.id }}
      />
    );
  }
  // if there is no id
  return <PreorderForm mode="create" />;
}
