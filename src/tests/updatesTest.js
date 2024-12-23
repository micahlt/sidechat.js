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

    const post = await API.getUpdates(API);
    console.log(post.user_posts);
  }
}

main();
