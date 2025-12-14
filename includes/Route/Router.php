<?php
namespace CF7SA\Route;

use CF7SA\Rest\Webhook\Webhook_Create_Controller;
use CF7SA\Rest\Webhook\Webhook_Callback_Controller;
use CF7SA\Rest\ContactForm7\CF7_Forms_Controller;

class Router {

    public static function init() {

        (new Webhook_Create_Controller())->register_routes();
        (new Webhook_Callback_Controller())->register_routes();
        (new CF7_Forms_Controller())->register_routes();
    }

     
}
