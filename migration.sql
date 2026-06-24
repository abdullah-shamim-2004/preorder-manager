-- CreateTable
CREATE TABLE "preorder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "products" INTEGER NOT NULL DEFAULT 1,
    "preorderwhen" TEXT NOT NULL DEFAULT 'REGARDLESS_OF_STOCK',
    "startsAt" DATETIME NOT NULL,
    "endAt" DATETIME,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

