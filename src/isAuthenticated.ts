import axios from "axios";

export default async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const user = await axios.get("/auth/isAuthenticated");
    if (user.data.isAuthencticated) {
      resolve();
    } else {
      reject();
    }
  });
};
