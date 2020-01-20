using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.Practices;
using Sabio.Models.Domain.Providers;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/datavis")]
    [ApiController]
    public class DataVisController : BaseApiController
    {
        IDataVisService _dataVisService = null; 

        public DataVisController(IDataVisService dataVisService, ILogger<DataVisController> logger) : base(logger)
        {
            _dataVisService = dataVisService;          
        }

        [HttpGet("providers")]
        public ActionResult<ItemResponse<List<ProviderDataVis>>> GetProviderData()
        {
            int code = 200;
            BaseResponse response;
            try
            {

                List<ProviderDataVis> providers = _dataVisService.GetProviderData();
                response = new ItemResponse<List<ProviderDataVis>>() { Item = providers };

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("practices")]
        public ActionResult<ItemResponse<List<PracticeDataVis>>> GetPracticeData()
        {
            int code = 200;
            BaseResponse response;
            try
            {

                List<PracticeDataVis> practices = _dataVisService.GetPracticeData();
                response = new ItemResponse<List<PracticeDataVis>>() { Item = practices };

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
