using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Sabio.Models.Domain;
using Sabio.Services;
using Stripe;
using Stripe.Checkout;
using System.IO;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/stripe")]
    [ApiController]
    public class StripeWebHook : Controller
    {
        IMedicalDataService _medService = null;
        StripeConfig _stripe = null;

        public StripeWebHook(IMedicalDataService medService, IOptions<StripeConfig> stripe)
        {
            _medService = medService;
            _stripe = stripe.Value;
        }       
        
        [AllowAnonymous]
        [HttpPost("subscribe")]
        public async Task<IActionResult> ReceiveSessionFromStripe()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], _stripe.WebhookSecret);

                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Session;

                    _medService.SubscribeUser(session.ClientReferenceId, session.SubscriptionId, session.DisplayItems[0].Plan.Nickname);
                    return Ok();

                }
                else
                {
                    return Ok();
                }

            }
            catch (StripeException err)
            {
                return BadRequest(err);
            }
        }
    }
}
