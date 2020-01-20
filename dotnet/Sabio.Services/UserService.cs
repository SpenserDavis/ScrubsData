using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests;
using Sabio.Models.Requests.UserProfiles;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserService : IUserService
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;
        private IEmailService _emailService;


        public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider, IEmailService emailService)
        {
            _authenticationService = authSerice;
            _dataProvider = dataProvider;
            _emailService = emailService;
        }

        //redacted

        public async Task<bool> LogInAsync(string email, string password)
        {
            bool isSuccessful = false;
            bool isConfirmed = CheckConfirmation(email);

            if (isConfirmed == true)
            {
                IUserAuthData response = Get(email, password);

                if (response != null)
                {
                    await _authenticationService.LogInAsync(response);
                    isSuccessful = true;
                }
            }

            return isSuccessful;
        }


        #region Unused Create Request
        public int Create(UserAddRequest userAddRequest, Guid token)
        {
            int userId = 0;
            string hashedPassword = GenerateHashedPassword(userAddRequest.Password);
            string procName = "[dbo].[Users_InsertV2]";

            _dataProvider.ExecuteNonQuery(procName, paramCol =>
            {
                SqlParameter sqlParam = new SqlParameter("@Id", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                paramCol.Add(sqlParam);
                paramCol.AddWithValue("@Token", token);
                paramCol.AddWithValue("@HashedPassword", hashedPassword);
                paramCol.AddWithValue("@Email", userAddRequest.Email);
            }, returnParams =>
            {
                Object oid = returnParams["@Id"].Value;
                Int32.TryParse(oid.ToString(), out userId);
            });
            return userId;
        }
        #endregion    

        public void UpdatePassword(PasswordUpdateRequest model, int userId)
        {
            string hashedPassword = GenerateHashedPassword(model.Password);

            string proc = "[dbo].[Users_Update_Password_Cycle]";

            _dataProvider.ExecuteNonQuery(proc, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@id", userId);
                paramCol.AddWithValue("@password", hashedPassword);
            });
        }

        public void UpdatePassword(PasswordUpdateRequest model)
        {
            string hashedPassword = GenerateHashedPassword(model.Password);
            string proc = "[dbo].[Users_Update_Password_Cycle]";

            _dataProvider.ExecuteNonQuery(proc, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@token", model.Token);
                paramCol.AddWithValue("@password", hashedPassword);
            });
        }



        private string GenerateHashedPassword(string password)
        {
            string salt = BCrypt.BCryptHelper.GenerateSalt();
            return BCrypt.BCryptHelper.HashPassword(password, salt);
        }
    }
}