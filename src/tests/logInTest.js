import { configDotenv } from "dotenv";
import { SidechatAPIClient } from "../index.js";
import PromptSync from "prompt-sync";
const prompt = new PromptSync();
configDotenv({ path: ".env.local", debug: true });

async function main() {
  const API = new SidechatAPIClient(process.env.SIDECHAT_TOKEN);
  if (!API.userToken) {
    const phoneNum = prompt("Phone number: ");
    await API.loginViaSMS(phoneNum);
    const code = prompt("Code: ");
    await API.verifySMSCode(phoneNum, code);
    console.log("User auth token:", API.userToken);
  } else {
    const updates = await API.getUpdates();
    console.log(updates);
    console.log(updates.user_posts.posts);
  }
}

main();
