using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class ProviderLicenseReport
    {
        public int Id { get; set; }
        public string LicenseNumber { get; set; }
        public DateTime DateExpires { get; set; }
        public string State { get; set; }
    }
}
