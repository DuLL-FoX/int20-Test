-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auctions" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "briefDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "auctionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "contactPointContactName" TEXT NOT NULL,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_details" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "auctionId" INTEGER NOT NULL,

    CONSTRAINT "auction_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_lot" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "objectClassifier" TEXT NOT NULL,
    "startPrice" INTEGER NOT NULL,
    "lotLogoUrl" TEXT,
    "auctionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "auctionBidUserId" INTEGER NOT NULL,

    CONSTRAINT "auction_lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_point" (
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT,

    CONSTRAINT "contact_point_pkey" PRIMARY KEY ("contactName")
);

-- CreateTable
CREATE TABLE "auction_bid" (
    "id" INTEGER NOT NULL,
    "lotId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "bidAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auction_bid_pkey" PRIMARY KEY ("id","userId","lotId")
);

-- CreateTable
CREATE TABLE "chat_session" (
    "id" SERIAL NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "messageText" TEXT NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auctions_slug_key" ON "auctions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "auction_lot_slug_key" ON "auction_lot"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "auction_lot_auctionId_key" ON "auction_lot"("auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "auction_lot_userId_key" ON "auction_lot"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auction_bid_id_key" ON "auction_bid"("id");

-- CreateIndex
CREATE UNIQUE INDEX "auction_bid_lotId_key" ON "auction_bid"("lotId");

-- CreateIndex
CREATE UNIQUE INDEX "auction_bid_userId_key" ON "auction_bid"("userId");

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_contactPointContactName_fkey" FOREIGN KEY ("contactPointContactName") REFERENCES "contact_point"("contactName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_details" ADD CONSTRAINT "auction_details_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_lot" ADD CONSTRAINT "auction_lot_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_lot" ADD CONSTRAINT "auction_lot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_lot" ADD CONSTRAINT "auction_lot_auctionBidUserId_fkey" FOREIGN KEY ("auctionBidUserId") REFERENCES "auction_bid"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_bid" ADD CONSTRAINT "auction_bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat_session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
