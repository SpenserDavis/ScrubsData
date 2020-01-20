using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models.Domain.TypeTables;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/typetables")]
    [ApiController]
    public class TypeTablesController : BaseApiController
    {
        private ITypeTablesService _service = null;
  
        public TypeTablesController(ITypeTablesService service, ILogger<TypeTablesController> logger) : base(logger)
        {
            _service = service;            
        }

        [HttpGet]
        public ActionResult<ItemsResponse<List<Object>>> SelectAll(string table)
        {
            int code = 200;
           
            BaseResponse response;

            try
            {
                List<Object> type =  _service.SelectAll(table);
                if (type == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemsResponse<Object> { Items = type };
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