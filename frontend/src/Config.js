import production from "./Configs/production"
import development from "./Configs/devolepment"

const config = process.env.ENVIRONMENT === "production" ? production : development;

export default config