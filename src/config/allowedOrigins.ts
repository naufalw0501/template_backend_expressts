const app_mode = process.env.APP_MODE

let allowed_origins: string[] = []

if (app_mode === 'PRODUCTION') {
    allowed_origins = [
        `http://localhost:${process.env.APP_PORT}`,
        `https://localhost:${process.env.APP_PORT}`,
    ]
} else {
    allowed_origins = [
        `http://localhost:3000`,
        `http://localhost:4000`,
        `http://192.168.1.4:3000`,
        `http://192.168.1.4:4000`,
        `https://localhost:3000`,
        `https://localhost:4000`,
        `https://192.168.1.4:3000`,
        `https://192.168.1.4:4000`,
    ]
}

export default allowed_origins;