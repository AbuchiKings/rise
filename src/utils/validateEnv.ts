import { cleanEnv, str, port, num } from "envalid";

export default function validateEnv(): void{
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices:['development', 'staging', 'production']
        }),
        //DATABSE_URL: str(),
        PORT: port({default: 8000}),
        SALT: num(),
        JWT_KEY: str(),
    })
}
