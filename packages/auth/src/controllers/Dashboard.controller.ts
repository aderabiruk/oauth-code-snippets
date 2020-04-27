import { Request, Response } from 'express';

class DashboardController {

    /**
     * Dashboard
     * 
     * @param {Request} request
     * @param {Response} response
     */
    static home(request: Request, response: Response) {
        let user: any = request.user;

        return response.render("dashboard/home", {
            title: "Dashboard",
            email: user.email
        });
    }
}

export default DashboardController;