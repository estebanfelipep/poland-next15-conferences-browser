-- CreateTable
CREATE TABLE "Talk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER NOT NULL,
    "tag" TEXT,
    "conference" TEXT NOT NULL,
    "duration" INTEGER,
    "videoUrl" TEXT,
    "slides" TEXT
);
