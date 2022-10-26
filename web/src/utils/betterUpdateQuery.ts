import { Cache, QueryInput } from '@urql/exchange-graphcache';

// TODO: não entendi muito bem, revisar este trecho
export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  fn: (result: Result, query: Query) => Query
) {
  return cache.updateQuery(queryInput, (data) => fn(result, data as any) as any);
}
