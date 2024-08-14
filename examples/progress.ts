import { progress } from "../src/utils/prompt";

function main() {
  let message = "Loading...";
  const prog = progress({ showPercentage: true, width: 50, message });
  let p = 0;
  const stop = setInterval(() => {
    if (p > 0.5) {
      message = "Almost done...";
    }
    prog.update(p, { message });
    p += 0.1;
    if (p > 1) {
      clearInterval(stop);
      prog.stop({ message: "Done!" });
    }
  }, 1000);
}

main();
