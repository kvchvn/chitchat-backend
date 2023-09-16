-- CreateTable
CREATE TABLE "_friendship_request" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_friendship" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friendship_request_AB_unique" ON "_friendship_request"("A", "B");

-- CreateIndex
CREATE INDEX "_friendship_request_B_index" ON "_friendship_request"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_friendship_AB_unique" ON "_friendship"("A", "B");

-- CreateIndex
CREATE INDEX "_friendship_B_index" ON "_friendship"("B");

-- AddForeignKey
ALTER TABLE "_friendship_request" ADD CONSTRAINT "_friendship_request_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friendship_request" ADD CONSTRAINT "_friendship_request_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friendship" ADD CONSTRAINT "_friendship_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friendship" ADD CONSTRAINT "_friendship_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
