import { execSync } from "child_process";

import parseArgs from "minimist";

const logger = console;

export async function pushWithGithubCount() {
    const args = parseArgs(process.argv);
    const commitMessage = args.m || args.commit;
    if (!commitMessage) {
        logger.error("please input commit message with -m or --commit option ...");
        return false;
    }
    const [oldUsername, oldEmail] = detectGitUsernameAndEmail();
    logger.info(`detect username = ${oldUsername}, email = ${oldEmail} ...`);
    logger.info("set username and email with github count ...");
    const githubUsername = "tensoar";
    const githubEmail = "tensoar@outlook.com";
    setGitUsernameAndEmail(githubUsername, githubEmail);
    const [usernameSeted, emailSeted] = detectGitUsernameAndEmail();
    if (usernameSeted !== githubUsername || emailSeted !== githubEmail) {
        logger.error("set git count to github failed ...");
        return false;
    }
    try {
        logger.info("exec git add ...");
        execSync("git add .");
    } catch (e) {
        logger.error(e);
        logger.error("add to github failed ...");
    }
    try {
        logger.info("exec git commit ...");
        execSync(`git commit -m "${commitMessage}"`);
    } catch (e) {
        logger.error(e);
        logger.error("commit to github failed ...");
    }
    try {
        logger.info("exec git push ...");
        execSync("git push");
    } catch (e) {
        logger.error(e);
        logger.error("push to github failed ...");
    }
    logger.info("restore username and email ...");
    setGitUsernameAndEmail(oldUsername, oldEmail);
    return true;
}

function setGitUsernameAndEmail(username: string, email: string) {
    execSync(`git config --global user.name "${username}"`);
    execSync(`git config --global user.email "${email}"`);
}

function detectGitUsernameAndEmail(): [string, string] {
    const username = execSync("git config --get user.name").toLocaleString();
    const email = execSync("git config --get user.email").toLocaleString();
    return [username.trim(), email.trim()];
}

