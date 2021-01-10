CREATE TABLE "users" (
	"id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"createdAt"	INTEGER NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "sessions" (
	"id"	INTEGER NOT NULL UNIQUE,
	"userId"	INTEGER NOT NULL,
	"token"	TEXT NOT NULL,
	"createdAt"	INTEGER NOT NULL,
	"expiresAt"	INTEGER NOT NULL,
	PRIMARY KEY("id")
	FOREIGN KEY("userId") REFERENCES "users"("id")
);

CREATE TABLE "snapshots" (
	"id"	INTEGER NOT NULL UNIQUE,
	"userId"	INTEGER NOT NULL,
	"date"	INTEGER NOT NULL,
	PRIMARY KEY("id")
	FOREIGN KEY("userId") REFERENCES "users"("id")
);

CREATE TABLE "currencies" (
	"id"	INTEGER NOT NULL UNIQUE,
	"userId"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES "users"("id")
);

CREATE TABLE "currencyValues" (
	"id"	INTEGER NOT NULL UNIQUE,
	"snapshotId"	INTEGER NOT NULL,
	"currencyId"	INTEGER NOT NULL,
	"value"	REAL NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("snapshotId") REFERENCES "snapshots"("id"),
	FOREIGN KEY("currencyId") REFERENCES "currencies"("id")
);

CREATE TABLE "assets" (
	"id"	INTEGER NOT NULL UNIQUE,
	"snapshotId"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"value"	REAL NOT NULL,
	"currencyId"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("snapshotId") REFERENCES "snapshots"("id"),
	FOREIGN KEY("currencyId") REFERENCES "currencies"("id")
);

