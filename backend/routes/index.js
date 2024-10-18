import express from 'express';

const router = express.Router();

router.get("/", (_, res) => {
  return res.status(200).json("🥰🌦 WELCOME TO AUNTY VANESSSA'S SUPER BESTEST WEATHER API 🥰🌦")
})

export default router
