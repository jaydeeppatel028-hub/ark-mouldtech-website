import { boolean, char, customType, datetime, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Mirrors db/schema.sql. Change both together. */

const mediumBlob = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "mediumblob",
});

const id = () => int("id", { unsigned: true }).autoincrement().primaryKey();
const ref = (name: string) => int(name, { unsigned: true });

export const media = mysqlTable("media", {
  id: id(),
  mime: varchar("mime", { length: 50 }).notNull(),
  width: int("width", { unsigned: true }).notNull(),
  height: int("height", { unsigned: true }).notNull(),
  bytes: int("bytes", { unsigned: true }).notNull(),
  data: mediumBlob("data").notNull(),
  alt: varchar("alt", { length: 255 }).notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: json("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const categories = mysqlTable("categories", {
  id: id(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 150 }).notNull(),
  groupName: varchar("group_name", { length: 100 }).notNull().default(""),
  summary: varchar("summary", { length: 500 }).notNull().default(""),
  photoId: ref("photo_id"),
  featured: boolean("featured").notNull().default(true),
  sort: int("sort").notNull().default(0),
});

export const products = mysqlTable("products", {
  id: id(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 150 }).notNull(),
  categoryId: ref("category_id").notNull(),
  description: text("description"),
  material: varchar("material", { length: 500 }),
  dimensions: varchar("dimensions", { length: 500 }),
  specifications: text("specifications"),
  applications: text("applications"),
  photoId: ref("photo_id"),
  sort: int("sort").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const machines = mysqlTable("machines", {
  id: id(),
  name: varchar("name", { length: 150 }).notNull(),
  quantity: varchar("quantity", { length: 30 }).notNull().default("1"),
  brand: varchar("brand", { length: 150 }),
  model: varchar("model", { length: 150 }),
  size: varchar("size", { length: 150 }),
  xTravel: varchar("x_travel", { length: 60 }),
  yTravel: varchar("y_travel", { length: 60 }),
  zTravel: varchar("z_travel", { length: 60 }),
  tableSize: varchar("table_size", { length: 100 }),
  maxCapacity: varchar("max_capacity", { length: 150 }),
  other: text("other"),
  photoId: ref("photo_id"),
  sort: int("sort").notNull().default(0),
});

export const gallery = mysqlTable("gallery", {
  id: id(),
  caption: varchar("caption", { length: 150 }).notNull(),
  description: varchar("description", { length: 500 }),
  photoId: ref("photo_id"),
  sort: int("sort").notNull().default(0),
});

export const clients = mysqlTable("clients", {
  id: id(),
  name: varchar("name", { length: 150 }).notNull(),
  website: varchar("website", { length: 255 }),
  logoId: ref("logo_id"),
  sort: int("sort").notNull().default(0),
});

export const testimonials = mysqlTable("testimonials", {
  id: id(),
  customerName: varchar("customer_name", { length: 150 }).notNull(),
  companyName: varchar("company_name", { length: 150 }),
  review: text("review"),
  screenshotId: ref("screenshot_id"),
  logoId: ref("logo_id"),
  sort: int("sort").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const inquiryStatus = ["pending", "contacted", "completed"] as const;

export const inquiries = mysqlTable("inquiries", {
  id: id(),
  name: varchar("name", { length: 100 }).notNull(),
  company: varchar("company", { length: 150 }).notNull(),
  address: varchar("address", { length: 300 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  inquiry: text("inquiry").notNull(),
  product: varchar("product", { length: 150 }),
  status: mysqlEnum("status", inquiryStatus).notNull().default("pending"),
  emailSent: boolean("email_sent").notNull().default(false),
  ip: varchar("ip", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminUsers = mysqlTable("admin_users", {
  id: id(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = mysqlTable("sessions", {
  tokenHash: char("token_hash", { length: 64 }).primaryKey(),
  userId: ref("user_id").notNull(),
  expiresAt: datetime("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const rateLimits = mysqlTable("rate_limits", {
  key: varchar("key", { length: 190 }).primaryKey(),
  hits: int("hits", { unsigned: true }).notNull(),
  resetAt: datetime("reset_at").notNull(),
});
