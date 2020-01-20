using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class ProviderLicense
    {
        public int Id { get; set; }
        public string LicenseNumber { get; set; }
        public DateTime DateExpires { get; set; }
        public int CreatedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public int ModifiedBy {get;set;}
        public DateTime DateModified { get; set; }
        public State State { get; set; }
        public UserProfile UserProfile { get; set; }
    }
}