CREATE TABLE "users" (
	"id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"created_at"	INTEGER NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "sessions" (
	"id"	INTEGER NOT NULL UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"token"	TEXT NOT NULL,
	"created_at"	INTEGER NOT NULL,
	"expires_at"	INTEGER NOT NULL,
	PRIMARY KEY("id")
	FOREIGN KEY("user_id") REFERENCES "users"("id")
);

CREATE TABLE "snapshots" (
	"id"	INTEGER NOT NULL UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"date"	INTEGER NOT NULL,
	PRIMARY KEY("id")
	FOREIGN KEY("user_id") REFERENCES "users"("id")
);

CREATE TABLE "currencies" (
	"id"	INTEGER NOT NULL UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("user_id") REFERENCES "users"("id")
);

CREATE TABLE "currency_values" (
	"id"	INTEGER NOT NULL UNIQUE,
	"snapshot_id"	INTEGER NOT NULL,
	"currency_id"	INTEGER NOT NULL,
	"value"	REAL NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("snapshot_id") REFERENCES "snapshots"("id"),
	FOREIGN KEY("currency_id") REFERENCES "currencies"("id")
);

CREATE TABLE "assets" (
	"id"	INTEGER NOT NULL UNIQUE,
	"snapshot_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"value"	REAL NOT NULL,
	"currency_id"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("snapshot_id") REFERENCES "snapshots"("id"),
	FOREIGN KEY("currency_id") REFERENCES "currencies"("id")
);

