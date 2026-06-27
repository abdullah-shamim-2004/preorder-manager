import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


// function for create new preorder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log(body);
    const { name, products, preorderWhen, startsAt, endsAt, status } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }
    if (!startsAt) {
      return NextResponse.json(
        { message: "Start date is required" },
        { status: 400 },
      );
    }

    // DB insert
    const preorder = await db.preorder.create({
      data: {
        name: name.trim(),
        products: products ?? 1,
        preorderWhen: preorderWhen ?? "REGARDLESS_OF_STOCK",
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        status: status ?? true,
      },
    });

    return NextResponse.json(preorder, { status: 201 });
  } catch (error) {
    console.error("[PREORDER_POST]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
