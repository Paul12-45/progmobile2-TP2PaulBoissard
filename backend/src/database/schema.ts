import { mysqlTable as table, int, varchar, decimal, date, index, primaryKey, check, type AnyMySqlColumn, timestamp } from "drizzle-orm/mysql-core";
import { user } from "./auth-schema.ts"
import { sql } from "drizzle-orm/sql/sql";
// Documentation officielle :
// https://orm.drizzle.team/docs/sql-schema-declaration#example
// https://orm.drizzle.team/docs/column-types