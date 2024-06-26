import { Service } from "../services";

const RESET = "\x1b[0m";
const BLACK = "\x1b[30m";
const WHITE = "\x1b[37m";
const MAGENTA = "\x1b[35m";
const BG_RED = "\x1b[41m";
const BG_YELLOW = "\x1b[43m";
const BG_BLUE = "\x1b[44m";
const BG_GREEN = "\x1b[42m";
const HIGHLIGHT_PATTERN = /"([\s\S]*?)"/g;

export const info = (message: string, service?: Service) => {
    print(`${BG_BLUE}${WHITE} INFO ${RESET}`, message, service);
}

export const error = (message: string, service?: Service) => {
    print(`${BG_RED}${WHITE} ERROR ${RESET}`, message, service);
}

export const warn = (message: string, service?: Service) => {
    print(`${BG_YELLOW}${BLACK} WARNING ${RESET}`, message, service);
}

export const complete = (message: string, service?: Service) => {
    print(`${BG_GREEN}${WHITE} COMPLETE ${RESET}`, message, service);
}

const print = (tag: string, message: string, service?: Service) => {
    message = addHighlights(message);
    const serviceTag = service === undefined ? "" : `[${service}]`;
    console.log(`${getDate()} - [${tag}]${serviceTag} ${message}`);
}

const addHighlights = (message: string) => {
    const results = message.match(HIGHLIGHT_PATTERN);
    if (results === null) return message;
    for (const result of results) {
        const temp = result.replace(/"/gi, "");

        message = message.replace(result, `${MAGENTA}${temp}${RESET}`);
    }
    return message;
}

const padZero = (number: number) => {
    return number < 10 ? `0${number}` : `${number}`;
}

const getDate = () => {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = padZero(now.getMonth() + 1);
    const day = padZero(now.getDate());

    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
