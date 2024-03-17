import { configDotenv } from "dotenv";
import { SidechatAPIClient } from "../index.js";
import PromptSync from "prompt-sync";
const prompt = new PromptSync();
configDotenv({ path: ".env.local", debug: true });

async function main() {
  const API = new SidechatAPIClient(process.env.SIDECHAT_TOKEN);
  if (!API.userToken) {
    return;
  } else {
    const updates = await API.setUserIcon(
      "e5b61b39-3e06-44e5-853f-18603a9d39c9",
      "😀",
      "#15FF46",
      "#3FC0FF"
    );
    console.log(updates);
  }
}

main();

/*

KNOWN WORKING HEX CODE PAIRINGS

#74DEEE - #239EAB
#15FF46 - #3FC0FF
#D9FB8A - #B1FD00
#FC40FF - #0DD5B2
#3E973C - #0F430E
#FFD305 - #F4B320
#8483FF - #5857FF
#FA81FF - #722DFF
#00CBFE - #0D13D5
#FF7B51 - #B2431F
#FF47CC - #69004C
#00EE6E - #0C75E6
#FF1885 - #FA81FF
#D8DC44 - #228B3F
*/
