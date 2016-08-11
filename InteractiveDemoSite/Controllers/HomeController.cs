using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InteractiveDemoSite.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Look around, or play a game?";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "If you can find me.";

            return View();
        }
    }
}