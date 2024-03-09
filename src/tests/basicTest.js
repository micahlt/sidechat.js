import { SidechatAPIClient } from "../index.js";
import PromptSync from "prompt-sync";
const prompt = new PromptSync();

async function main() {
  const API = new SidechatAPIClient(
    "eyJhbGciOiJIUzI1NiJ9.ZTViNjFiMzktM2UwNi00NGU1LTg1M2YtMTg2MDNhOWQzOWM5.gOl2_HPyPzcyNpTXqSQEuJ3ZUmZi7Zq_vSBoRfbKA1A"
  );
  if (API.userToken) {
    const phoneNum = prompt("Phone number: ");
    await API.loginViaSMS(phoneNum);
    const code = prompt("Code: ");
    await API.verifySMSCode(phoneNum, code);
    console.log("User auth token:", API.userToken);
  } else {
  }
}

main();
