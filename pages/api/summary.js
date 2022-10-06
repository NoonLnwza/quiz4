import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }

    //compute DB summary
    const users = readUsersDB();
    const customer = users.filter((x) => x.isAdmin === false);
    const totalMoney = customer.reduce((p, c) => {
      return (p += c.money);
    }, 0);
    //return response
    res.json({
      ok: true,
      userCount: customer.length,
      adminCount: users.length - customer.length,
      totalMoney,
    });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
