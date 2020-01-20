using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe.Checkout;
using System;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/medicaldata")]
    [ApiController]
    public class MedicalDataController : BaseApiController
    {
        IMedicalDataService _medService = null;
        IAuthenticationService<int> _auth = null;

        public MedicalDataController(IMedicalDataService medService, IAuthenticationService<int> auth, ILogger<MedicalDataController> logger) : base(logger)
        {
            _medService = medService;
            _auth = auth;
        }

        [HttpGet("subscribe/{plan}")]
        public ActionResult<ItemResponse<Session>> Subscribe(string plan)
        {
            int code = 200;
            BaseResponse response;
            try
            {
                int userId = _auth.GetCurrentUserId();
                Session session = _medService.CreateCheckoutSession(plan, userId);
                response = new ItemResponse<Session>() { Item = session };

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("status")]
        public ActionResult<ItemResponse<UserSubscription>> GetUserSubStatus()
        {
            int code = 200;
            BaseResponse response;
            try
            {
                int userId = _auth.GetCurrentUserId();
                UserSubscription subscription = _medService.GetUserSubStatus(userId);
                response = new ItemResponse<UserSubscription> { Item = subscription };
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }       

        [HttpGet("changekey")]
        public ActionResult<ItemResponse<Guid>> ChangeApiKey()
        {
            int code = 200;
            BaseResponse response;
            try
            {
                int userId = _auth.GetCurrentUserId();
                Guid apiKey = _medService.ChangeApiKey(userId);
                response = new ItemResponse<Guid> { Item = apiKey };
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("cancel")]
        public async Task<ActionResult<SuccessResponse>> CancelSubscription()
        {
            int code = 200;
            BaseResponse response;
            try
            {
                int userId = _auth.GetCurrentUserId();
                await _medService.CancelSubscription(userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
    }
}
