import * as API from "../index.js";

async function main() {
  const res = await API.setVote();
  console.log(await res);
}

main();
