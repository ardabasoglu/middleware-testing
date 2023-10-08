/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from "next";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // "body" is empty on Netlify, when "hasRequiredFields" method is called in "middleware.ts
  // This only happens on Netlify, not on localhost
  const { body } = req;
  console.log("foo/bar.ts - body: ", body);
  res.status(200).json({ message: body });
};

export default handler;
