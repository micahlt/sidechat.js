import { configDotenv } from "dotenv";
import { SidechatAPIClient } from "../index.js";
import PromptSync from "prompt-sync";
const prompt = new PromptSync();
configDotenv({ path: ".env.local", debug: true });

async function main() {
  const API = new SidechatAPIClient(process.env.SIDECHAT_TOKEN);
  if (!API.userToken) {
    console.error("No token defined.");
    return;
  } else {
    const action = prompt("Start or list DMs? ");
    if (action == "start") {
      return;
    } else if (action == "list") {
      const res = await API.getDMs();
      console.log(res[0]);
    }
  }
}

main();
