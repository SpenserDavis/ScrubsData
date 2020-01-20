using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Providers;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("dev")]
    [ApiController]
    public class ExternalDevController : BaseApiController
    {
        IExternalDevApiService _devService = null;

        public ExternalDevController(
            IExternalDevApiService devService,      
            ILogger<MedicalDataController> logger) : base(logger)
        {
            _devService = devService;
            
        }

        [HttpGet("providers/details")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetAllProviderDetails()
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetAllProviderDetails(apiKey);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("providers/affiliation")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetProvidersByAffiliation(string q)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetProvidersByAffiliation(apiKey, q);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
        
        [HttpGet("providers/certification")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetProvidersByCertification(string q)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetProvidersByCertification(apiKey, q);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
        
        [HttpGet("providers/expertise")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetProvidersByExpertise(string q)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetProvidersByExpertise(apiKey, q);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("providers/{id:int}")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetProvidersById(int id)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetProvidersById(apiKey, id);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("providers/insuranceplan")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetProvidersByInsurancePlan(string q)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetProvidersByInsurancePlan(apiKey, q);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("providers/language")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetProvidersByLanguage(string q)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetProvidersByLanguage(apiKey, q);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("providers/specialization")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetProvidersBySpecialization(string q)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetProvidersBySpecialization(apiKey, q);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }          

        [HttpGet("providers/license")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> GetProvidersByState(string q)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.GetProvidersByState(apiKey, q);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
        
        [HttpGet("providers/search")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ProviderReport>> SearchProvidersByName(string q)
        {
            int code = 200;
            string apiKey = Request.Headers["api-key"];
            BaseResponse response;
            try
            {
                List<ProviderReport> providers = _devService.SearchProvidersByName(apiKey, q);

                if (providers == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<ProviderReport>> { Item = providers };
                }

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
