import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// type of RouteContext
type RouteContext = {
  params: Promise<{ id: string }>;
};

// put request for form update
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, products, preorderWhen, startsAt, endsAt, status } = body;
    const existing = await db.preorder.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    const updated = await db.preorder.update({
      where: { id },
      data: {
        name: name.trim(),
        products: products ?? existing.products,
        preorderWhen: preorderWhen ?? existing.preorderWhen,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        status: status ?? existing.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PREORDER_PUT]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
