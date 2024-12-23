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
    const action = prompt(
      "Create, delete, get comments, or comment on a post? "
    );
    if (action == "create") {
      const post = await API.createPost(
        "I am so bored of spring break ngl",
        "e953e1cc-7e17-46b9-b11a-98441e4135fe",
        [],
        false,
        false
      );
      if (post.id) {
        console.log("CREATED POST >> ID:", post.id);
      } else {
        console.log("FAILED AT CREATION.");
        return;
      }
    } else if (action == "delete") {
      const id = prompt("ID of post or comment to delete? ");
      const res = await API.deletePostOrComment(id);
      console.log(res);
    } else if (action == "comment on") {
      const id = prompt("ID of post to comment on? ");
      const group = prompt("Group ID of post? ");
      const replyID = prompt("Reply ID? (optional) ");
      const res = await API.createComment(id, "ye", group, replyID);
      console.log(res);
    } else if (action == "get comments") {
      const id = prompt("ID of post to get comments from? ");
      const comments = await API.getPostComments(id);
      console.log(comments);
    }
  }
}

main();
