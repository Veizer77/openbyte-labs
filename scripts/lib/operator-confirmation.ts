/** Explicit flags preserve target confirmation for operator commands without a TTY. */
export function hasOperatorConfirmation(
  args: readonly string[],
  database: string,
  keyword?: string,
): boolean {
  return (
    args.includes(`--confirm-target=${database}`) &&
    (!keyword || args.includes(`--confirm-keyword=${keyword}`))
  );
}
