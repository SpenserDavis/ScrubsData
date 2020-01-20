using Microsoft.Extensions.Options;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class MedicalDataService : IMedicalDataService
    {
        IDataProvider _data = null;
        StripeConfig _stripe = null;

        public MedicalDataService(IDataProvider data, IOptions<StripeConfig> stripe)
        {
            _data = data;
            _stripe = stripe.Value;
        }

        public void SubscribeUser(string userId, string stripeId, string subType)
        {
            
            string procName = "[dbo].[Subscriptions_Insert]";
            int sub = 0;

            switch (subType)
            {
                case "Limited":
                    sub = 1;
                    break;
                case "Premium":
                    sub = 2;
                    break;
            }

            _data.ExecuteNonQuery(procName, paramCol =>
            {
                paramCol.AddWithValue("@userId", userId);
                paramCol.AddWithValue("@stripeId", stripeId);
                paramCol.AddWithValue("@subType", sub);
            });
        }

        public UserSubscription GetUserSubStatus(int userId)
        {
            string procName = "[dbo].[Subscriptions_Select_ByUserId]";

            UserSubscription subscription = null;
           
            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@userId", userId);
            }, (reader, set) =>
             {
                subscription = HydrateSubscription(reader);
               
             });

            return subscription;
        }

        public Session CreateCheckoutSession(string desiredPlan, int userId)
        {
            
            StripeConfiguration.ApiKey = _stripe.ApiKey;

            string plan = null;

            switch (desiredPlan)
            {
                case "limited":
                    plan = "plan_GTcq9tW3RQtg9P";
                    break;
                case "premium":
                    plan = "plan_GTuEvtQtooGEF5";
                    break;
            }

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> 
                {
                    "card",
                },
                SubscriptionData = new SessionSubscriptionDataOptions
                {
                    Items = new List<SessionSubscriptionDataItemOptions>
                    {
                        new SessionSubscriptionDataItemOptions
                        {
                            Plan = plan
                        },
                    },
                },
                ClientReferenceId = $"{userId}",
                SuccessUrl = "https://scrubsdata.azurewebsites.net/medicaldata",
                CancelUrl = "https://scrubsdata.azurewebsites.net/medicaldata",
            };

            var service = new SessionService();
            Session session = service.Create(options);
            return session;
        }

        public Guid ChangeApiKey(int userId)
        {
            string procName = "[dbo].[Subscriptions_Update_ApiKey]";
            Guid apiKey = Guid.Empty;
            _data.ExecuteNonQuery(procName, paramCol =>
            {
                paramCol.AddWithValue("@userId", userId);
                SqlParameter sqlParam = new SqlParameter("@apiKey", SqlDbType.UniqueIdentifier)
                {
                    Direction = ParameterDirection.Output
                };
                paramCol.Add(sqlParam);
            },returnParameters =>
            {
                Object oid = returnParameters["@apiKey"].Value;
                Guid.TryParse(oid.ToString(), out apiKey);
            });
            return apiKey;
        }

        public async Task CancelSubscription(int userId)
        {
            StripeConfiguration.ApiKey = _stripe.ApiKey;
            string stripeSubKey = "";
            string procName = "[dbo].[Subscriptions_SelectStripeId_byUserId]";

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@userId", userId);
            },(reader,set)=> {

                stripeSubKey = reader.GetSafeString(0);
            });
           
            var service = new SubscriptionService();
            try
            {
                await service.CancelAsync(stripeSubKey, null);
                procName = "[dbo].[Subscriptions_Update_ActiveStatus_SetInactive]";

                _data.ExecuteNonQuery(procName, paramCol =>
                {
                    paramCol.AddWithValue("@userId", userId);
                });
            }
            catch
            {
                throw new Exception("Unable to Cancel Stripe Subscription.");                
            }
                       
        }

        private UserSubscription HydrateSubscription(IDataReader reader)
        {
            UserSubscription subscription = new UserSubscription();
            int index = 0;
            subscription.Id = reader.GetSafeInt32(index++);
            subscription.UserId = reader.GetSafeInt32(index++);
            subscription.IsActive = reader.GetSafeBool(index++);
            subscription.ApiKey = reader.GetSafeGuid(index++);
            subscription.RequestCount = reader.GetSafeInt32(index++);
            subscription.LastSubscribedDate = reader.GetSafeDateTime(index++);
            subscription.StripeId = reader.GetSafeString(index++);
            subscription.SubscriptionType = reader.GetSafeString(index++);

            return subscription;

        }



    }
}
