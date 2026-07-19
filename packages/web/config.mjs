const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://ai.awmate.nxtgensec.org" : `https://${stage}.awmate.ai`,
  console: stage === "production" ? "https://ai.awmate.nxtgensec.org/auth" : `https://${stage}.awmate.ai/auth`,
  email: "help@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/anomalyco/awmate",
  discord: "https://ai.awmate.nxtgensec.org/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
