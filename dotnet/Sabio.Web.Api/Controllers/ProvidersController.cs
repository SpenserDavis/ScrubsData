using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Providers;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Locations;
using Sabio.Models.Requests.Practice;
using Sabio.Models.Requests.Providers;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{

    [Route("api/providers")]
    [ApiController]
    public class ProvidersController : BaseApiController
    {

        private IProvidersService _service = null;
        private IAuthenticationService<int> _auth = null;
        private IEmailService _emailService = null;
        public ProvidersController(IProvidersService service, IEmailService emailService
            , ILogger<ProvidersController> logger
            , IAuthenticationService<int> auth) : base(logger)
        {
            _service = service;
            _auth = auth;
            _emailService = emailService;
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> DeleteById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteById(id);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                code = 500;
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost("new")]
        public ActionResult<ItemResponse<int>> InsertV2(ProviderAddRequest provider)
        {
            ObjectResult result = null;

            try
            {
                int userId = _auth.GetCurrentUserId();
                int newId = _service.InsertV2(provider, userId);
                ItemResponse<int> response = new ItemResponse<int> { Item = newId };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPost("report/full")]
        public FileStreamResult ReportSelectAll(ProviderDetailCategories categories)
        {

            BaseResponse response;
            try
            {
                IUserAuthData user = _auth.GetCurrentUser();
                MemoryStream stream = null;
                if (user.Roles.Contains("Office Manager") || (user.Roles.Contains("SysAdmin")))
                {
                    if (user.Roles.Contains("SysAdmin"))
                    {
                        stream = _service.ReportSelectAll(categories, 0);
                    }
                    else
                    {
                        stream = _service.ReportSelectAll(categories, user.Id);
                    }
                }


                if (stream == null)
                {
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    stream.Position = 0;
                    var contentType = "application/octet-stream";
                    var fileName = "ProviderReport.xlsx";
                    return File(stream, contentType, fileName);

                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());

                response = new ErrorResponse(ex.Message);
            }
            return null;
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Provider>>> Search(string q, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Provider> providerSearch = _service.Search(q, pageIndex, pageSize);

                if (providerSearch == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Provider>> { Item = providerSearch };
                }

            }
            catch (Exception ex)
            {

                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }


        [HttpGet]
        public ActionResult<ItemResponse<Paged<ProviderBase>>> SelectAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<ProviderBase> pagedItems = _service.SelectAll(pageIndex, pageSize);

                if (pagedItems == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<ProviderBase>> { Item = pagedItems };
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


        [HttpGet("details")]
        public ActionResult<ItemResponse<Paged<Provider>>> SelectAllDetails(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Provider> pagedItems = _service.SelectAllDetails(pageIndex, pageSize);

                if (pagedItems == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Provider>> { Item = pagedItems };
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

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<Provider>>> SelectByCreatedBy(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _auth.GetCurrentUserId();
                Paged<Provider> pagedItems = _service.SelectByCreatedBy(userId, pageIndex, pageSize);

                if (pagedItems == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Provider>> { Item = pagedItems };
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

        [HttpGet("expertise/{id:int}")]
        public ActionResult<ItemResponse<Paged<Provider>>> SelectByExpertise(int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Provider> pagedItems = _service.SelectByExpertise(id, pageIndex, pageSize);

                if (pagedItems == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Provider>> { Item = pagedItems };
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

        [HttpGet("provider/{id:int}")]
        public ActionResult<ItemResponse<int>> SelectProviderByUserId(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int provider = _service.SelectProviderByUserId(id);
                if (provider == 0)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<int>() { Item = provider };

                }

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<ProviderBase>> SelectById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                ProviderBase provider = _service.SelectById(id);
                if (provider == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<ProviderBase>() { Item = provider };

                }

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("insuranceplans/{id:int}")]
        public ActionResult<ItemResponse<Paged<Provider>>> SelectByInsurancePlan(int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Provider> pagedItems = _service.SelectByInsurancePlan(id, pageIndex, pageSize);

                if (pagedItems == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Provider>> { Item = pagedItems };
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

        [HttpGet("specializations/{id:int}")]
        public ActionResult<ItemResponse<Paged<Provider>>> SelectBySpecialization(int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Provider> pagedItems = _service.SelectBySpecialization(id, pageIndex, pageSize);

                if (pagedItems == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Provider>> { Item = pagedItems };
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

        [HttpGet("states/{id:int}")]
        public ActionResult<ItemResponse<Paged<Provider>>> SelectByState(int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Provider> pagedItems = _service.SelectByState(id, pageIndex, pageSize);

                if (pagedItems == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Provider>> { Item = pagedItems };
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

        [HttpGet("{id:int}/details")]
        public ActionResult<ItemResponse<Provider>> SelectDetailsById(int id)
        {
            int code = 200;
            BaseResponse response;
            try
            {
                IUserAuthData user = _auth.GetCurrentUser();
                Provider provider = null;

                if (user.Roles.Contains("SysAdmin"))
                {
                    provider = _service.SelectDetailsById(id);
                }
                if (!user.Roles.Contains("Consumer") && !user.Roles.Contains("SysAdmin"))
                {
                    if (id == user.Id)
                    //provider is making request
                    {
                        provider = _service.SelectDetailsById(id);
                    }
                    else
                    //office manager or provider assistant is making request
                    {
                        provider = _service.SelectDetailsById(id, user.Id);
                    }

                }

                if (provider == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Provider>() { Item = provider };

                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> UpdateV2(ProviderUpdateRequest provider)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _auth.GetCurrentUserId();
                _service.UpdateV2(provider, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        //redacted

    }
}
