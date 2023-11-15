import { PrismaClientDbMain, PrismaManager } from "@bash/db";

type MsgOrErrorFactory = string | (() => Error);

function createAssertException(
  msgOrErrorFactory?: string | (() => Error),
  fallbackMsg?: string,
) {
  if (
    typeof msgOrErrorFactory === "string" ||
    msgOrErrorFactory === undefined
  ) {
    throw new Error(
      msgOrErrorFactory ?? fallbackMsg ?? "Assertion did not pass.",
    );
  }
  throw msgOrErrorFactory();
}

const isNonEmptyString = (v: unknown, trim = true): v is string => {
  return typeof v === "string" && (trim ? v.trim() : v).length > 0;
};

function assertNonEmptyString(
  v: unknown,
  msgOrErrorFactory?: MsgOrErrorFactory,
  /** auto-trim, default true */
  trim?: boolean,
): asserts v is string {
  if (!isNonEmptyString(v, trim ?? true)) {
    throw createAssertException(msgOrErrorFactory);
  }
}

const isDev = process.env?.NODE_ENV === "development";

export const getPrismaClientDbMain: () => PrismaClientDbMain = () => {
  const url = process.env?.PRISMA_DATABASE_URL ?? null;
  assertNonEmptyString(
    url,
    () =>
      new Error(
        `[Error] Cannot create prisma client instance, missing env variable PRISMA_DATABASE_URL.`,
      ),
  );

  return PrismaManager.getDevSafeInstance("db-main", () => {
    const prismaClient = new PrismaClientDbMain({
      datasources: {
        db: {
          url: url,
        },
      },
      errorFormat: isDev ? "pretty" : "colorless",
      log: [
        {
          level: "query",
          emit: "event",
        },
        {
          level: "error",
          emit: "stdout",
        },
        {
          level: "info",
          emit: "stdout",
        },
        {
          level: "warn",
          emit: "stdout",
        },
      ],
    });
    if (isDev) {
      prismaClient.$on("query", (e) => {
        console.log("Query: " + e.query);
        console.log("Duration: " + e.duration + "ms");
      });
    }
    return prismaClient;
  });
};
