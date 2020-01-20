using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Users;
using Sabio.Models.Enums;
using Sabio.Models.Requests;
using Sabio.Models.Requests.UserProfiles;
using Sabio.Models.Requests.Users;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Core;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : BaseApiController
    {
        IEmailService _emailService = null;
        IUserService _userService = null;
        IAuthenticationService<int> _authService = null;
        IOptions<SecurityConfig> _options;

        public AuthController(IUserService service, IAuthenticationService<int> auth
            , IEmailService emailService
            , ILogger<AuthController> logger
            , IOptions<SecurityConfig> options) : base(logger)
        {
            _emailService = emailService;
            _userService = service;
            _authService = auth;
            _options = options;
        }



        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<ItemResponse<int>>> CreateAsyncV2(UserAddRequestV2 userAddRequest)
        {
            ObjectResult result = null;

            try
            {
                Guid token = Guid.NewGuid();

                int userId = _userService.CreateV2(userAddRequest, token);
                if (userId != 0)
                {
                    EmailResponse item = await _emailService.ConfirmEmail(userAddRequest.Email, token);
                    ItemResponse<int> response = new ItemResponse<int> { Item = userId };
                    result = Created201(response);
                }

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }

            return result;
        }

        //redacted

        [HttpPut("{id:int}")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> ConfirmUser(UserIsConfirmed model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _userService.ConfirmEmail(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse>> LogInAsync(UserLogin userLogin)
        {
            int code = 200;
            BaseResponse response = null;
            bool loginSuccessful = false;
            try
            {
                loginSuccessful = await _userService.LogInAsync(userLogin.Name, userLogin.Password);
                if (loginSuccessful == false)
                {
                    code = 401;
                    response = new ErrorResponse("Login credentials not valid.");
                }
                else
                {
                    response = new SuccessResponse();
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

        [HttpGet("current")]
        public ActionResult<ItemResponse<IUserAuthData>> GetCurrentUser()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                IUserAuthData user = _authService.GetCurrentUser();
                response = new ItemResponse<IUserAuthData> { Item = user };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);

        }

        [HttpGet("logout")]
        public async Task<ActionResult<SuccessResponse>> LogOutAsync()
        {
            BaseResponse response;
            int code = 200;
            try
            {
                await _authService.LogOutAsync();
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

        [HttpPut("resetpassword")]
        public ActionResult<SuccessResponse> UpdatePassword(PasswordUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _userService.UpdatePassword(model, userId);

                //redacted

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);

        }

        [HttpPut("resetpasswordanon")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> UpdatePasswordAnon(PasswordUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response;
            try
            {
                _userService.UpdatePassword(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {

                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }

            return StatusCode(iCode, response);

        }

        [HttpGet("roles")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<List<Role>>> GetRole()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Role> role = _userService.GetRoles();
                if (role == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemsResponse<Role> { Items = role };
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


        //redacted

    }
}
