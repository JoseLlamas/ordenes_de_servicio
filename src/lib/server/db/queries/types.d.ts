import { db } from '..';

type DbInstance = typeof db;

export type DbOrTx = DbInstance | Parameters<Parameters<DbInstance['transaction']>[0]>[0];