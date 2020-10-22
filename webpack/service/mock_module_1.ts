// @ts-ignore
import express, {Request, Response, NextFunction} from 'express';

module.exports = function (app: express.Application): void {
    app
        .get('/mock/test', function(req: Request, res: Response, next: NextFunction) {
            res.json({ status: 1, data: {name: 'webpack.before.service.mock_module_1' }});
        })
        .get('/mock/ping', function(req: Request, res: Response, next: NextFunction) {
            res.json({ status: 1, data: {name: 'webpack.before.service.mock_module_1.ping' }});
        });
};
