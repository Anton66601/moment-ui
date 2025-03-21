-- CreateTable
CREATE TABLE "EventType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventType_name_key" ON "EventType"("name");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_type_fkey" FOREIGN KEY ("type") REFERENCES "EventType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
