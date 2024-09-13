export async function middleware(args: unknown[], ...funcs: Function[]) {
  for await (const func of funcs) {
    await func(...args);
  }
}
