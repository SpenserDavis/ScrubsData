using System;
using System.Collections.Generic;
using System.Text;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;
using Sabio.Services.Interfaces;
using Sabio.Models.Domain;
using Newtonsoft.Json;
using Sabio.Models.Domain.Email;
using Microsoft.Extensions.Options;
using Sabio.Models.Requests;
using System.IO;
using Sabio.Models;

namespace Sabio.Services
{
    public class EmailService : IEmailService
    {
        private EmailConfig _emailConfig = null;
        private DomainConfig _domainConfig = null;

        public EmailService(IOptions<EmailConfig> emailConfig, IOptions<DomainConfig> domainConfig)
        {
            _emailConfig = emailConfig.Value;
            _domainConfig = domainConfig.Value;
        }

        //redacted

        private string RegisterEmailBody(string link)

        {
            string body = string.Empty;
            string pwd = Directory.GetCurrentDirectory();
            string path = pwd + @"\Templates\RegisterTemplateV2.html";
            StreamReader reader = new StreamReader(path);
            body = reader.ReadToEnd();
            body = body.Replace("{link}", link);

            return body;

        }


        private string EmailBody(string link, string emailTemplatePath)
        {
            string body = string.Empty;
            StreamReader reader = new StreamReader(emailTemplatePath);

            body = reader.ReadToEnd();
            body = body.Replace("{link}", link);
            reader.Close();

            return body;
        }
    }
}
