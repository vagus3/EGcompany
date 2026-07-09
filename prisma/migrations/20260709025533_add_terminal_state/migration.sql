-- CreateTable
CREATE TABLE "TerminalState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "currentStage" TEXT NOT NULL DEFAULT 'pin-select',
    "unlockedMailIds" JSONB NOT NULL,
    "completedChallengeIds" JSONB NOT NULL,
    "adminTestRequired" BOOLEAN NOT NULL DEFAULT true,
    "adminTestPassed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TerminalState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TerminalState_userId_key" ON "TerminalState"("userId");
