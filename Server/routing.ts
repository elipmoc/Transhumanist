const router = require('router');
const finalhandler = require('finalhandler');

export function createRouter() {
    let myRouter = router();
    return (req: any, res: any) => {
        myRouter(req, res, finalhandler(req, res));
    }
}

