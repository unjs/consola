import { boxy } from "./utils/box";
import type { BoxyOpts } from "./utils/box";

export default async function box(
  title: string,
  opts?: BoxyOpts
): Promise<void> {
  console.log(await boxy(title, opts));
}
