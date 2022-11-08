import fs from "fs";
import User from "../models/User.js";

const getUsersData = () => {
  const content = fs.readFileSync("src/assets/JSON/Users.json");
  const users = JSON.parse(content);

  return users[2].data;
};

const addUsers = async () => {
  const users = getUsersData();

  console.log("Adding Users");
  for (const user of users) {
    await User.create({
      chatId: user.chatId,
      name: user.name,
      userName: user.userName,
    });
  }
  console.log("Adding completed");
};

addUsers();
